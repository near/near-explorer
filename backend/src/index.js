const autobahn = require("autobahn");
const bs58 = require("bs58");

const nearlib = require("nearlib");

const models = require("../models");

const nearRpcUrl = process.env.NEAR_RPC_URL || "https://rpc.nearprotocol.com";
const nearRpc = new nearlib.providers.JsonRpcProvider(nearRpcUrl);
const syncFetchQueueSize = process.env.NEAR_SYNC_FETCH_QUEUE_SIZE || 1000;
const syncSaveQueueSize = process.env.NEAR_SYNC_SAVE_QUEUE_SIZE || 10;
const bulkDbUpdateSize = process.env.NEAR_SYNC_BULK_DB_UPDATE_SIZE || 10;
const regularSyncNewNearcoreStateInterval =
  process.env.NEAR_REGULAR_SYNC_NEW_NEARCORE_STATE_INTERVAL || 1000;
const regularSyncMissingNearcoreStateInterval =
  process.env.NEAR_REGULAR_SYNC_MISSING_NEARCORE_STATE_INTERVAL || 60000;

const wamp = new autobahn.Connection({
  realm: "near-explorer",
  transports: [
    {
      url: process.env.WAMP_NEAR_EXPLORER_URL || "ws://localhost:8080/ws",
      type: "websocket"
    }
  ],
  authmethods: ["ticket"],
  authid: "near-explorer-backend",
  onchallenge: (session, method, extra) => {
    if (method === "ticket") {
      return process.env.WAMP_NEAR_EXPLORER_BACKEND_SECRET || "back";
    }
    throw "WAMP authentication error: unsupported challenge method";
  }
});

function setupWamp() {
  wamp.onopen = async session => {
    console.log("WAMP connection is established. Waiting for commands...");
    await session.register(
      "com.nearprotocol.explorer.select",
      async ([query, replacements]) => {
        return await models.sequelizeReadOnly.query(query, {
          replacements,
          type: models.Sequelize.QueryTypes.SELECT
        });
      }
    );

    // This is an example of sending an event
    /*
    let counter = 0;
    setInterval(async () => {
      await session.publish("com.nearprotocol.explorer.oncounter", [counter]);
      console.log("published to 'oncounter' with counter " + counter);
      counter += 1;
    }, 1000);
    */
  };

  wamp.onclose = reason => {
    console.log(
      "WAMP connection has been closed (check WAMP router availability and credentials):",
      reason
    );
  };

  console.log("Starting WAMP connection...");
  wamp.open();
}

function toBase58(input) {
  if (typeof input === "string") {
    return input;
  }
  return bs58.encode(Buffer.from(input));
}

async function saveBlocks(blocksInfo) {
  try {
    await models.sequelize.transaction(async transaction => {
      try {
        await models.Block.bulkCreate(
          blocksInfo.map(blockInfo => {
            return {
              hash: toBase58(blockInfo.header.hash),
              height: blockInfo.header.height,
              prevHash: toBase58(blockInfo.header.prev_hash),
              timestamp: blockInfo.header.timestamp,
              weight: blockInfo.header.total_weight.num,
              authorId: "n/a", // TODO
              listOfApprovals: "n/a" // TODO
            };
          })
        );

        // XXX: Chunks are not 1-to-1 matching with Blocks, but they are not ready in nearcore, yet.
        await models.Chunk.bulkCreate(
          blocksInfo.map(blockInfo => {
            const hash = toBase58(blockInfo.header.hash);
            return {
              hash,
              blockHash: hash,
              shardId: "n/a",
              authorId: "n/a"
            };
          })
        );

        await Promise.all(
          blocksInfo
            .filter(blockInfo => blockInfo.transactions.length > 0)
            .map(blockInfo => {
              models.Transaction.bulkCreate(
                blockInfo.transactions.map(tx => {
                  const kind = Object.keys(tx.body)[0];
                  const args = tx.body[kind];
                  return {
                    hash: toBase58(tx.hash),
                    originator: args.originator,
                    destination: "n/a", // TODO
                    kind,
                    args,
                    parentHash: null, // TODO
                    chunkHash: toBase58(blockInfo.header.hash), // TODO: use real chunk hash instead of block hash
                    status: "Completed", // TODO
                    logs: "" // TODO
                  };
                })
              );
            })
        );
      } catch (error) {
        console.warn("Failed to save a bulk of blocks due to ", error);
      }
    });
  } catch (error) {
    console.warn("Failed to save a bulk of blocks due to ", error);
  }
}

async function syncNearcoreBlocks(topBlockHeight, bottomBlockHeight) {
  console.log(
    `Syncing Nearcore blocks from ${topBlockHeight} down to ${bottomBlockHeight}...`
  );
  let syncingBlockHeight = topBlockHeight;
  const requests = [];
  const saves = [];

  while (syncingBlockHeight >= bottomBlockHeight) {
    //console.debug(`Syncing the block #${syncingBlockHeight}...`);
    requests.push(
      nearRpc.block(syncingBlockHeight).catch(e => {
        console.error(
          `Something went wrong while fetching block #${syncingBlockHeight}: `,
          e
        );
        return null;
      })
    );
    --syncingBlockHeight;
    if (requests.length > syncFetchQueueSize) {
      let blocks = await Promise.all(requests.splice(0, bulkDbUpdateSize));
      blocks = blocks.filter(response => response !== null);
      saves.push(saveBlocks(blocks));
    }
    if (saves.length > syncSaveQueueSize) {
      await saves.shift();
    }
  }
  let blocks = await Promise.all(requests);
  blocks = blocks.filter(response => response !== null);
  saves.push(saveBlocks(blocks));
  await Promise.all(saves);
}

async function syncNewNearcoreState() {
  const latestSyncedBlock = await models.Block.findOne({
    order: [["height", "DESC"]]
  });
  let latestSyncedBlockHeight = 0;
  if (latestSyncedBlock !== null) {
    latestSyncedBlockHeight = latestSyncedBlock.height;
    console.debug(`The latest synced block is #${latestSyncedBlockHeight}`);
  } else {
    console.debug("There are no synced blocks, yet.");
  }

  const nodeStatus = await nearRpc.status();
  let latestBlockHeight = nodeStatus.sync_info.latest_block_height;
  if (typeof latestBlockHeight !== "number") {
    console.error(
      "The latest block height is unknown. The received node status is:",
      nodeStatus
    );
    return;
  }

  await syncNearcoreBlocks(latestBlockHeight, latestSyncedBlockHeight + 1);
}

async function syncOldNearcoreState() {
  const oldestSyncedBlock = await models.Block.findOne({ order: ["height"] });
  let oldestSyncedBlockHeight = 0;
  if (oldestSyncedBlock !== null) {
    oldestSyncedBlockHeight = oldestSyncedBlock.height;
    console.debug(`The oldest synced block is #${oldestSyncedBlockHeight}`);
  }

  await syncNearcoreBlocks(oldestSyncedBlockHeight - 1, 1);
}

async function syncMissingNearcoreState() {
  const latestSyncedBlock = await models.Block.findOne({
    order: [["height", "DESC"]]
  });
  if (latestSyncedBlock === null) {
    return;
  }

  const oldestSyncedBlock = await models.Block.findOne({ order: ["height"] });
  if (oldestSyncedBlock === null) {
    return;
  }

  const syncMissingNearcoreBlocks = async (lowHeight, highHeight) => {
    if (lowHeight > highHeight) {
      return;
    }
    const syncedBlocksCount = await models.Block.count({
      where: {
        height: {
          [models.Sequelize.Op.between]: [lowHeight, highHeight]
        }
      }
    });
    if (highHeight - lowHeight + 1 === syncedBlocksCount) {
      return;
    }
    if (
      highHeight - lowHeight <= syncFetchQueueSize &&
      syncedBlocksCount === 0
    ) {
      await syncNearcoreBlocks(highHeight, lowHeight);
      return;
    }
    const midHeight = Math.floor((lowHeight + highHeight) / 2);
    await syncMissingNearcoreBlocks(lowHeight, midHeight);
    await syncMissingNearcoreBlocks(midHeight + 1, highHeight);
  };

  await syncMissingNearcoreBlocks(
    oldestSyncedBlock.height + 1,
    latestSyncedBlock.height - 1
  );
}

async function syncFullNearcoreState() {
  await syncNewNearcoreState();
  await syncMissingNearcoreState();
  await syncOldNearcoreState();
}

async function main() {
  syncFullNearcoreState();

  // TODO: we should publish (push) the information about the new blocks/transcations via WAMP.
  const regularSyncNewNearcoreState = async () => {
    await syncNewNearcoreState();
    setTimeout(
      regularSyncNewNearcoreState,
      regularSyncNewNearcoreStateInterval
    );
  };
  setTimeout(
    regularSyncNewNearcoreState,
    regularSyncNewNearcoreStateInterval * 10
  );

  const regularSyncMissingNearcoreState = async () => {
    await syncMissingNearcoreState();
    setTimeout(
      regularSyncMissingNearcoreState,
      regularSyncMissingNearcoreStateInterval
    );
  };
  setTimeout(
    regularSyncMissingNearcoreState,
    regularSyncMissingNearcoreStateInterval
  );

  setupWamp();
}

main();
