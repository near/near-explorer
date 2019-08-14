const bs58 = require("bs58");

const nearlib = require("nearlib");

const models = require("../models");

const {
  nearRpcUrl,
  syncFetchQueueSize,
  syncSaveQueueSize,
  bulkDbUpdateSize
} = require("./config");
const { toBase58, Result } = require("./utils");

const nearRpc = new nearlib.providers.JsonRpcProvider(nearRpcUrl);

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
              timestamp: parseInt(blockInfo.header.timestamp / 1000000),
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

function promiseResult(promise) {
  // Convert a promise to an always-resolving promise of Result type.
  return new Promise(resolve => {
    const payload = new Result();
    promise
      .then(result => {
        payload.value = result;
      })
      .catch(error => {
        payload.error = error;
      })
      .then(() => {
        resolve(payload);
      });
  });
}

async function saveBlocksFromRequests(requests) {
  const responses = await Promise.all(requests.map(([_, req]) => req));
  const blocks = responses.flatMap((blockResult, index) => {
    const blockHeight = requests[index][0];
    if (blockResult.isError()) {
      const { error } = blockResult;
      if (error.type === "system") {
        console.log(
          `A system error was catched while fetching the block #${blockHeight}: `,
          error.message
        );
      } else {
        console.warn(
          `Something went wrong while fetching the block #${blockHeight}: `,
          error
        );
      }
      return [];
    }
    return [blockResult.value];
  });

  return await saveBlocks(blocks);
}

async function syncNearcoreBlocks(topBlockHeight, bottomBlockHeight) {
  if (topBlockHeight < bottomBlockHeight) {
    return;
  }
  console.log(
    `Syncing Nearcore blocks from ${topBlockHeight} down to ${bottomBlockHeight}...`
  );
  let syncingBlockHeight = topBlockHeight;
  const requests = [];
  const saves = [];

  while (syncingBlockHeight >= bottomBlockHeight) {
    //console.debug(`Syncing the block #${syncingBlockHeight}...`);
    requests.push([
      syncingBlockHeight,
      promiseResult(nearRpc.block(syncingBlockHeight))
    ]);
    --syncingBlockHeight;
    if (requests.length > syncFetchQueueSize) {
      saves.push(saveBlocksFromRequests(requests.splice(0, bulkDbUpdateSize)));
    }
    if (saves.length > syncSaveQueueSize) {
      await saves.shift();
    }
  }
  saves.push(saveBlocksFromRequests(requests));
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
    console.warn(
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
  try {
    await syncNewNearcoreState();
  } catch (error) {
    console.warn("Syncing new Nearcore state crashed due to:", error);
  }
  try {
    await syncMissingNearcoreState();
  } catch (error) {
    console.warn("Syncing missing Nearcore state crashed due to:", error);
  }
  try {
    await syncOldNearcoreState();
  } catch (error) {
    console.warn("Syncing old Nearcore state crashed due to:", error);
  }
}

exports.syncFullNearcoreState = syncFullNearcoreState;
exports.syncNewNearcoreState = syncNewNearcoreState;
exports.syncOldNearcoreState = syncOldNearcoreState;
exports.syncMissingNearcoreState = syncMissingNearcoreState;
