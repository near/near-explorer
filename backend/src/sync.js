const request = require("request");
const JSONStream = require("JSONStream");
const models = require("../models");
const moment = require("moment");

const {
  syncFetchQueueSize,
  syncSaveQueueSize,
  bulkDbUpdateSize,
  syncNewBlocksHorizon,
} = require("./config");
const { nearRpc } = require("./near");
const { Result, promiseResult, delayFor } = require("./utils");

let genesisHeight;

async function saveBlocks(blocksInfo) {
  try {
    await models.sequelize.transaction(async (transaction) => {
      try {
        await models.Block.bulkCreate(
          blocksInfo.map((blockInfo) => {
            return {
              hash: blockInfo.header.hash,
              height: blockInfo.header.height,
              prevHash: blockInfo.header.prev_hash,
              timestamp: parseInt(blockInfo.header.timestamp / 1000000),
              totalSupply: blockInfo.header.total_supply,
              gasPrice: blockInfo.header.gas_price,
              author: blockInfo.author,
            };
          }),
          { ignoreDuplicates: true }
        );

        await models.Chunk.bulkCreate(
          blocksInfo.flatMap((blockInfo) => {
            let { chunks } = blockInfo;
            return chunks.map((chunkInfo) => {
              return {
                blockHash: blockInfo.header.hash,
                shardId: chunkInfo.shard_id,
                signature: chunkInfo.signature,
                gasLimit: chunkInfo.gas_limit,
                gasUsed: chunkInfo.gas_used,
                heightCreated: chunkInfo.height_created,
                heightIncluded: chunkInfo.height_included,
              };
            });
          }),
          { ignoreDuplicates: true }
        );
        // TODO: check the status of transactions and filter out the failling transactions in the following table.
        await Promise.all(
          blocksInfo
            .filter((blockInfo) => blockInfo.transactions.length > 0)
            .map((blockInfo) => {
              const timestamp = parseInt(blockInfo.header.timestamp / 1000000);
              return Promise.all([
                models.Transaction.bulkCreate(
                  blockInfo.transactions.map((tx, index) => {
                    return {
                      hash: tx.hash,
                      nonce: tx.nonce,
                      blockHash: blockInfo.header.hash,
                      blockTimestamp: timestamp,
                      transactionIndex: index,
                      signerId: tx.signer_id,
                      signerPublicKey: tx.signer_public_key || tx.public_key,
                      signature: tx.signature,
                      receiverId: tx.receiver_id,
                    };
                  }),
                  { ignoreDuplicates: true }
                ),
                models.Action.bulkCreate(
                  blockInfo.transactions.flatMap((tx) => {
                    const transactionHash = tx.hash;
                    return tx.actions.map((action, index) => {
                      if (typeof action === "string") {
                        return {
                          transactionHash,
                          actionIndex: index,
                          actionType: action,
                          actionArgs: {},
                        };
                      }
                      if (action.DeployContract !== undefined) {
                        delete action.DeployContract.code;
                      } else if (action.FunctionCall !== undefined) {
                        delete action.FunctionCall.args;
                      }
                      const type = Object.keys(action)[0];
                      return {
                        transactionHash,
                        actionIndex: index,
                        actionType: type,
                        actionArgs: action[type],
                      };
                    });
                  }),
                  { ignoreDuplicates: true }
                ),
                models.AccessKey.bulkCreate(
                  blockInfo.transactions.flatMap((tx) => {
                    return tx.actions
                      .filter((action) => action.AddKey !== undefined)
                      .map((action) =>
                        prepareAccessKeyModel(tx.receiver_id, action.AddKey)
                      );
                  }),
                  { ignoreDuplicates: true }
                ),
                models.Account.bulkCreate(
                  blockInfo.transactions
                    .filter((tx) =>
                      tx.actions.some(
                        (action) =>
                          action === "CreateAccount" ||
                          action.CreateAccount !== undefined
                      )
                    )
                    .map((tx, index) => {
                      return {
                        accountId: tx.receiver_id,
                        accountIndex: index,
                        createdByTransactionHash: tx.hash,
                        createdAtBlockTimestamp: timestamp,
                      };
                    }),
                  { ignoreDuplicates: true }
                ),
              ]);
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

async function prepareAccessKeyModel(accountId, accessKey) {
  let accessKeyType;
  const permission = accessKey.access_key.permission;
  if (typeof permission === "string") {
    accessKeyType = permission;
  } else if (permission !== undefined) {
    accessKeyType = Object.keys(permission)[0];
  } else {
    throw new Error(
      `Unexpected error during access key permission parsing in transaction ${
        tx.hash
      }: the permission type is expected to be a string or an object with a single key,
      but '${JSON.stringify(permission)}' found.`
    );
  }
  return {
    accountId,
    publicKey: accessKey.public_key,
    accessKeyType,
  };
}

async function saveBlocksFromRequests(requests) {
  const responses = await Promise.all(requests.map(([_, req]) => req));
  let blocks = responses
    .map((blockResult, index) => {
      const blockHeight = requests[index][0];
      if (blockResult.isError()) {
        const { error } = blockResult;
        if (error.type === "system") {
          console.log(
            `A system error was catched while fetching the block #${blockHeight}: `,
            error.message
          );
        } else if (error.message && error.message.includes("Not Found")) {
          // It is absolutely fine to ignore the blocks that were never produced.
          // However, we should better not query those in the first place (NEAR
          // Indexer for Explorer will address this)
        } else if (error.message && error.message.includes("Missing")) {
          console.warn(
            `Block #${blockHeight} is missing. Make sure that the RPC node is archival and fully synced.`
          );
        } else {
          console.warn(
            `Something went wrong while fetching the block #${blockHeight}: `,
            error
          );
        }
        return null;
      }
      return blockResult.value;
    })
    .filter((block) => block !== null);

  blocks = (
    await Promise.all(
      blocks.flatMap(async (block) => {
        try {
          const detailedChunks = await Promise.all(
            block.chunks.map(async (chunk) => {
              let fetchError;
              for (let retries = 5; retries > 0; --retries) {
                try {
                  return await nearRpc.chunk(chunk.chunk_hash);
                } catch (error) {
                  fetchError = error;
                  if (error.type === "system") {
                    await delayFor(100 + Math.random() * 1000);
                    continue;
                  }
                  if (
                    error.type === "UntypedError" &&
                    error.message.includes("Not Found")
                  ) {
                    console.error(
                      `The chunk ${chunk.chunk_hash} (from block ${block.header.hash} #${block.header.height} shard id #${chunk.shard_id}) is not found. This usually means that the node does not track the shard, garbage collected the chunk, or was offline during the chunk production. Use another node to sync from, otherwise, Explorer will miss the information for the whole block, including transactions in the block.`
                    );
                    throw error;
                  }
                  console.error(
                    "Failed to fetch a detailed chunk info: ",
                    error,
                    chunk
                  );
                  throw error;
                }
              }
              throw fetchError;
            })
          );
          block.transactions = detailedChunks.flatMap(
            (chunk) => chunk.transactions
          );
          return block;
        } catch (error) {
          return null;
        }
      })
    )
  ).filter((block) => block !== null);

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
      promiseResult(nearRpc.block({ blockId: syncingBlockHeight })),
    ]);
    --syncingBlockHeight;
    if (requests.length >= syncFetchQueueSize) {
      saves.push(saveBlocksFromRequests(requests.splice(0, bulkDbUpdateSize)));
    }
    if (saves.length >= syncSaveQueueSize) {
      await saves.shift();
    }
  }
  saves.push(saveBlocksFromRequests(requests));
  await Promise.all(saves);
}

async function syncNewNearcoreState() {
  const nodeStatus = await nearRpc.status();
  let latestBlockHeight = nodeStatus.sync_info.latest_block_height;
  if (typeof latestBlockHeight !== "number") {
    console.warn(
      "The latest block height is unknown. The received node status is:",
      nodeStatus
    );
    return;
  }

  const latestSyncedBlock = await models.Block.findOne({
    order: [["height", "DESC"]],
  });
  let targetBlockHeight;
  if (latestSyncedBlock !== null) {
    console.debug(`The latest synced block is #${latestSyncedBlock.height}`);
    if (
      latestBlockHeight - latestSyncedBlock.height <
      syncNewBlocksHorizon * 5
    ) {
      targetBlockHeight = latestSyncedBlock.height;
    } else {
      targetBlockHeight = latestBlockHeight - syncNewBlocksHorizon;
      console.debug(
        `The latest synced block #${latestSyncedBlock.height} is far behind of the latest block #${latestBlockHeight}. Syncing the latest ${syncNewBlocksHorizon} blocks...`
      );
    }
  } else {
    targetBlockHeight = latestBlockHeight - syncNewBlocksHorizon;
    console.debug(
      `There are no synced blocks, yet. Syncing the latest ${syncNewBlocksHorizon} blocks...`
    );
  }

  await syncNearcoreBlocks(latestBlockHeight, targetBlockHeight + 1);
}

async function syncOldNearcoreState() {
  const oldestSyncedBlock = await models.Block.findOne({ order: ["height"] });
  let oldestSyncedBlockHeight = 0;
  if (oldestSyncedBlock !== null) {
    oldestSyncedBlockHeight = oldestSyncedBlock.height;
    console.debug(`The oldest synced block is #${oldestSyncedBlockHeight}`);
  }
  await syncNearcoreBlocks(oldestSyncedBlockHeight - 1, genesisHeight);
}

async function syncMissingNearcoreState() {
  await syncOldNearcoreState();

  const latestSyncedBlock = await models.Block.findOne({
    order: [["height", "DESC"]],
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
          [models.Sequelize.Op.between]: [lowHeight, highHeight],
        },
      },
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

async function syncGenesisState() {
  let genesisTime;
  let genesisAccountIndex = 0;
  const stream = request({
    url:
      "http://s3-us-west-1.amazonaws.com/build.nearprotocol.com/nearcore-deploy/betanet/genesis.json",
  }).pipe(JSONStream.parse("records.*"));
  stream.on("header", function (config) {
    genesisHeight = config.genesis_height;
    genesisTime = moment(config.genesis_time).valueOf();
  });
  stream.on("data", async function (record) {
    if (record.AccessKey !== undefined) {
      await models.AccessKey.upsert(
        prepareAccessKeyModel(record.AccessKey.account_id, record.AccessKey)
      );
    } else if (record.Account !== undefined) {
      genesisAccountIndex += 1;
      await models.Account.upsert({
        accountId: record.Account.account_id,
        accountIndex: genesisAccountIndex,
        createdByTransactionHash: "Genesis",
        createdAtBlockTimestamp: genesisTime,
      });
    }
  });
  stream.on("end", async function (record) {
    console.log(`Genesis Records are all inserted into database`);
  });
}

exports.syncNewNearcoreState = syncNewNearcoreState;
exports.syncMissingNearcoreState = syncMissingNearcoreState;
exports.syncGenesisState = syncGenesisState;
