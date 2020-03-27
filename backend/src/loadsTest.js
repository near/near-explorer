const models = require("../models");

async function saveBlocks(blocksInfo) {
  try {
    await models.sequelize.transaction(async transaction => {
      try {
        await models.Block.bulkCreate(
          blocksInfo.map(blockInfo => {
            return {
              hash: blockInfo.hash,
              height: blockInfo.height,
              prevHash: blockInfo.prev_hash,
              timestamp: blockInfo.timestamp,
              totalSupply: blockInfo.total_supply,
              gasLimit: blockInfo.gas_limit,
              gasUsed: blockInfo.gas_used,
              gasPrice: blockInfo.gas_price
            };
          })
        );

        await Promise.all(
          blocksInfo.flatMap(blockInfo => {
            let { chunks, transactions } = blockInfo;
            models.Chunk.bulkCreate(
              chunks.map(chunkInfo => {
                return {
                  blockHash: chunkInfo.hash,
                  shardId: chunkInfo.shard_id,
                  signature: chunkInfo.signature,
                  gasLimit: chunkInfo.gas_limit,
                  gasUsed: chunkInfo.gas_used,
                  heightCreated: chunkInfo.height,
                  heightIncluded: chunkInfo.height
                };
              })
            );
            models.Transaction.bulkCreate(
              transactions.flatMap(tx => {
                return {
                  hash: tx.hash,
                  nonce: tx.nonce,
                  blockHash: blockInfo.hash,
                  signerId: tx.signer_id,
                  signerPublicKey: tx.public_key,
                  signature: tx.signature,
                  receiverId: tx.receiver_id
                };
              })
            );
            models.Action.bulkCreate(
              transactions.flatMap(tx => {
                const transactionHash = tx.hash;
                return tx.actions.map((action, index) => {
                  if (typeof action === "string") {
                    return {
                      transactionHash,
                      actionIndex: index,
                      actionType: action,
                      actionArgs: {}
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
                    actionArgs: action[type]
                  };
                });
              })
            ),
              models.Account.bulkCreate(
                transactions
                  .filter(tx =>
                    tx.actions.some(
                      action =>
                        action === "CreateAccount" ||
                        action.CreateAccount !== undefined
                    )
                  )
                  .map(tx => {
                    return {
                      accountId: tx.receiver_id,
                      transactionHash: tx.hash,
                      timestamp: blockInfo.timestamp
                    };
                  })
              );
          })
        );
      } catch (error) {
        console.warn("Failed to save blocks due to ", error);
      }
    });
  } catch (error) {
    console.warn("Failed to save blocks due to ", error);
  }
}

function generateBlocks(number) {
  let hashMap = Array(number);
  let signatureMap = Array(number);
  for (i = 0; i < number; i++) {
    hashMap[i] = [...Array(44)]
      .map(i => (~~(Math.random() * 36)).toString(36))
      .join("");
    signatureMap[i] = [...Array(20)]
      .map(i => (~~(Math.random() * 36)).toString(36))
      .join("");
  }
  let preHashMap = Array(number);
  preHashMap[0] = "";
  for (i = 1; i < number; i++) {
    preHashMap[i] = hashMap[i - 1];
  }
  const total_supply = 1.00517009572021e36;
  const gas_limit = 0;
  const gas_used = 0;
  const gas_price = "5000";

  let blocks = Array(number);
  for (height = 0; height < number; height++) {
    const transactions = generateTxs();
    const chunks = generateChunks(height + 400);
    blocks[height] = {
      hash: hashMap[height],
      prev_hash: preHashMap[height],
      height: height + 400,
      timestamp: height * 1000,
      total_supply,
      gas_price,
      gas_limit,
      gas_used,
      chunks,
      transactions
    };
  }
  return saveBlocks(blocks);
}

function generateChunks(height) {
  let chunks = Array(10);
  for (i = 0; i < 10; i++) {
    chunks[i] = {
      hash: [...Array(44)]
        .map(i => (~~(Math.random() * 36)).toString(36))
        .join(""),
      height: height,
      shard_id: i,
      signature: [...Array(44)]
        .map(i => (~~(Math.random() * 36)).toString(36))
        .join(""),
      gas_limit: 0,
      gas_used: 0
    };
  }
  return chunks;
}

function generateTxs() {
  const actionsMap = [
    [
      "CreateAccount",
      {
        Transfer: {
          deposit: "10000001000000000000000000"
        }
      },
      {
        AddKey: {
          access_key: {
            nonce: 0,
            permission: "FullAccess"
          },
          public_key: "ed25519:BrS1EexaxmZRykBGdRQyRNUfwURHGfWNWqMm2jREWTub"
        }
      }
    ],
    [
      {
        Transfer: {
          deposit: "2000000000000000000000000"
        }
      }
    ],
    [
      {
        FunctionCall: {
          args:
            "eyJrZXkiOiJudW1MZXR0ZXJzIiwidmFsdWUiOiJTVU9HbnM0ckNMSFFLMW5lRnVkS0RCQjN0OW5NSUM5UjI2S0t1VENCTHFDVVRCbGJYcmNQazZrPSJ9",
          deposit: "0",
          gas: 200000000000000,
          method_name: "set"
        }
      }
    ],
    [
      {
        Transfer: {
          deposit: "22000000000000000000000000"
        }
      },
      {
        Transfer: {
          deposit: "8800000000000000000000000"
        }
      }
    ],
    [
      {
        Transfer: {
          deposit: "100020001000000000000000000"
        }
      }
    ],
    [
      {
        DeployContract: {
          code: "qujdAU0+T4zUzdOMJIrQhdWXTJ/KY4j022u+StVUpyo="
        }
      }
    ],
    [
      {
        AddKey: {
          access_key: {
            nonce: 0,
            permission: "FullAccess"
          },
          public_key: "ed25519:7gDFEkXYmtzgtgTRE6m41dB4Vrm6no1JEx27y9YV8V77"
        }
      }
    ],
    [
      "CreateAccount",
      {
        Transfer: {
          deposit: "10000001000000000000000000"
        }
      },
      {
        AddKey: {
          access_key: {
            nonce: 0,
            permission: "FullAccess"
          },
          public_key: "ed25519:BrS1EexaxmZRykBGdRQyRNUfwURHGfWNWqMm2jREWTub"
        }
      }
    ],
    [
      {
        Transfer: {
          deposit: "2000000000000000000000000"
        }
      }
    ],
    ["DeleteAccount"]
  ];
  let transactions = Array(1000);
  for (i = 0; i < 1000; i++) {
    transactions[i] = {
      hash: [...Array(44)]
        .map(i => (~~(Math.random() * 36)).toString(36))
        .join(""),
      nonce: i * 100,
      public_key:
        "ed25519:" +
        [...Array(44)].map(i => (~~(Math.random() * 36)).toString(36)).join(""),
      receiver_id: [...Array(10)]
        .map(i => (~~(Math.random() * 36)).toString(36))
        .join(""),
      signer_id: [...Array(10)]
        .map(i => (~~(Math.random() * 36)).toString(36))
        .join(""),
      signature: [...Array(44)]
        .map(i => (~~(Math.random() * 36)).toString(36))
        .join(""),
      actions: actionsMap[i % 10]
    };
  }
  return transactions;
}

exports.generateBlocks = generateBlocks;
