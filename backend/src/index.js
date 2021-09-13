const moment = require("moment");
const BN = require("bn.js");

const models = require("../models");

const {
  isLegacySyncBackendEnabled,
  isIndexerBackendEnabled,
  backupDbOnReset,
  regularCheckGenesisInterval,
  regularSyncNewNearcoreStateInterval,
  regularSyncMissingNearcoreStateInterval,
  regularPublishFinalityStatusInterval,
  regularQueryStatsInterval,
  regularPublishNetworkInfoInterval,
  regularFetchStakingPoolsInfoInterval,
  regularStatsInterval,
  wampNearNetworkName,
  regularFetchStakingPoolsMetadataInfoInterval,
  regularPublishTransactionCountForTwoWeeksInterval,
} = require("./config");

const { DS_LEGACY_SYNC_BACKEND, DS_INDEXER_BACKEND } = require("./consts");

const { nearRpc, queryFinalBlock, queryEpochStats } = require("./near");

const {
  syncNewNearcoreState,
  syncMissingNearcoreState,
  syncGenesisState,
} = require("./sync");

const { setupWamp, wampPublish } = require("./wamp");

const {
  extendWithTelemetryInfo,
  queryOnlineNodes,
  pickOnlineValidatingNode,
  getSyncedGenesis,
  queryDashboardBlocksStats,
  queryTransactionsCountHistoryForTwoWeeks,
  queryRecentTransactionsCount,
} = require("./db-utils");

const {
  aggregateTeragasUsedByDate,
  aggregateTransactionsCountByDate,
  aggregateNewAccountsCountByDate,
  aggregateDeletedAccountsCountByDate,
  aggregateNewContractsCountByDate,
  aggregateUniqueDeployedContractsCountByDate,
  aggregateActiveContractsCountByDate,
  aggregateActiveAccountsCountByDate,
  aggregateActiveAccountsCountByWeek,
  aggregateActiveAccountsList,
  aggregateActiveContractsList,
  aggregatePartnerTotalTransactionsCount,
  aggregatePartnerFirst3MonthTransactionsCount,
  aggregateDepositAmountByDate,
  aggregateParterUniqueUserAmount,
  aggregateLiveAccountsCountByDate,
} = require("./stats");

const nonValidatingNodeStatuses = ["on-hold", "newcomer", "idle"];

let transactionsCountHistoryForTwoWeeks = [];
let currentValidators = [];
let stakingNodes = [];
let stakingPoolsInfo = new Map();
let stakingPoolsMetadataInfo = new Map();

// async function startLegacySync() {
//   console.log("Starting NEAR Explorer legacy syncing service...");

//   let genesisHeight, genesisTime, genesisChainId;

//   const SyncGenesisState = async () => {
//     console.log("Starting Genesis state sync...");
//     try {
//       await syncGenesisState();
//     } catch (error) {
//       console.warn("Genesis state crashed due to:", error);
//     }
//   };

//   const syncedGenesis = await getSyncedGenesis();
//   if (syncedGenesis) {
//     genesisHeight = syncedGenesis.genesisHeight;
//     genesisTime = syncedGenesis.genesisTime;
//     genesisChainId = syncedGenesis.chainId;
//   } else {
//     setTimeout(SyncGenesisState, 0);
//   }

//   const regularCheckGenesis = async () => {
//     console.log("Starting regular Genesis check...");
//     try {
//       const genesisConfig = await nearRpc.sendJsonRpc(
//         "EXPERIMENTAL_genesis_config"
//       );
//       const genesisConfigGenesisTime = moment(
//         genesisConfig.genesis_time
//       ).valueOf();
//       if (
//         (genesisHeight &&
//           genesisHeight !== genesisConfig.genesis_height.toString()) ||
//         (genesisTime && genesisTime !== genesisConfigGenesisTime) ||
//         (genesisChainId && genesisChainId !== genesisConfig.chain_id)
//       ) {
//         console.log(
//           `Genesis has changed (height ${genesisHeight} -> ${genesisConfig.genesis_height}; \
//           time ${genesisTime} -> ${genesisConfigGenesisTime}; chain id ${genesisChainId} -> \
//           ${genesisConfig.chain_id}). We are resetting the database and shutting down the backend \
//           to let it auto-start and sync from scratch.`
//         );
//         models.resetDatabase({ saveBackup: backupDbOnReset });
//         process.exit(0);
//       }
//       genesisHeight = genesisConfig.genesis_height.toString();
//       genesisTime = genesisConfigGenesisTime;
//       console.log("Regular Genesis check is completed.");
//     } catch (error) {
//       console.warn("Regular Genesis check crashed due to:", error);
//     }
//     setTimeout(regularCheckGenesis, regularCheckGenesisInterval);
//   };
//   setTimeout(regularCheckGenesis, 0);

//   const regularSyncNewNearcoreState = async () => {
//     console.log("Starting regular new nearcore state sync...");
//     try {
//       await syncNewNearcoreState();
//       console.log("Regular new nearcore state sync is completed.");
//     } catch (error) {
//       console.warn("Regular new nearcore state sync crashed due to:", error);
//     }
//     setTimeout(
//       regularSyncNewNearcoreState,
//       regularSyncNewNearcoreStateInterval
//     );
//   };
//   setTimeout(regularSyncNewNearcoreState, 0);

//   const regularSyncMissingNearcoreState = async () => {
//     console.log("Starting regular missing nearcore state sync...");
//     try {
//       await syncMissingNearcoreState();
//       console.log("Regular missing nearcore state sync is completed.");
//     } catch (error) {
//       console.warn(
//         "Regular missing nearcore state sync crashed due to:",
//         error
//       );
//     }
//     setTimeout(
//       regularSyncMissingNearcoreState,
//       regularSyncMissingNearcoreStateInterval
//     );
//   };
//   setTimeout(
//     regularSyncMissingNearcoreState,
//     regularSyncMissingNearcoreStateInterval
//   );
// }

function getDataSourceSpecificTopicName(baseTopicName, dataSource) {
  return `${baseTopicName}:${dataSource}`;
}

function startDataSourceSpecificJobs(wamp, dataSource) {
  const regularCheckDataStats = async () => {
    console.log(`Starting regular data stats check from ${dataSource}...`);
    try {
      if (wamp.session) {
        const blocksStats = await queryDashboardBlocksStats({ dataSource });
        const recentTransactionsCount = await queryRecentTransactionsCount();

        wampPublish(
          getDataSourceSpecificTopicName("chain-blocks-stats", dataSource),
          blocksStats,
          wamp
        );
        wampPublish(
          getDataSourceSpecificTopicName(
            "chain-transactions-stats",
            dataSource
          ),
          {
            transactionsCountHistoryForTwoWeeks,
            recentTransactionsCount,
          },
          wamp
        );
      }
      console.log(`Regular data stats check from ${dataSource} is completed.`);
    } catch (error) {
      console.warn(
        `Regular data stats check from ${dataSource} is crashed due to:`,
        error
      );
    }
    setTimeout(regularCheckDataStats, regularQueryStatsInterval);
  };
  setTimeout(regularCheckDataStats, 0);
}

function startStatsAggregation() {
  const regularStatsAggregate = async () => {
    console.log("Starting Regular Stats Aggregation...");
    try {
      //stats part
      // transactions related
      await aggregateTransactionsCountByDate();
      await aggregateTeragasUsedByDate();
      await aggregateDepositAmountByDate();

      // account
      await aggregateNewAccountsCountByDate();
      await aggregateDeletedAccountsCountByDate();
      await aggregateLiveAccountsCountByDate();
      await aggregateActiveAccountsCountByDate();
      await aggregateActiveAccountsCountByWeek();
      await aggregateActiveAccountsList();

      // contract
      await aggregateNewContractsCountByDate();
      await aggregateActiveContractsCountByDate();
      await aggregateUniqueDeployedContractsCountByDate();
      await aggregateActiveContractsList();

      //partner part
      await aggregatePartnerTotalTransactionsCount();
      await aggregatePartnerFirst3MonthTransactionsCount();
      await aggregateParterUniqueUserAmount();
    } catch (error) {
      console.warn("Regular Stats Aggregation is crashed due to:", error);
    }
    setTimeout(regularStatsAggregate, regularStatsInterval);
  };
  setTimeout(regularStatsAggregate, 0);
}

async function main() {
  console.log("Starting Explorer backend...");

  await models.sequelizeLegacySyncBackend.sync();

  const wamp = setupWamp();
  console.log("Starting WAMP worker...");
  wamp.open();

  // regular transactions count
  const regularPublishTransactionsCount = async () => {
    console.log("Starting regular transactions count for week check...");
    try {
      transactionsCountHistoryForTwoWeeks = await queryTransactionsCountHistoryForTwoWeeks();
    } catch (error) {
      console.warn(
        "Regular transactions count for week crashed due to:",
        error
      );
    }
    setTimeout(
      regularPublishTransactionsCount,
      regularPublishTransactionCountForTwoWeeksInterval
    );
  };
  setTimeout(regularPublishTransactionsCount, 0);

  // regularly publish the latest information about the height and timestamp of the final block
  const regularPublishFinalityStatus = async () => {
    console.log("Starting regular final timestamp check...");
    try {
      if (wamp.session) {
        const finalBlock = await queryFinalBlock();
        wampPublish(
          "finality-status",
          {
            finalBlockTimestampNanosecond: finalBlock.header.timestamp_nanosec,
            finalBlockHeight: finalBlock.header.height,
          },
          wamp
        );
      }
      console.log("Regular final timestamp check is completed.");
    } catch (error) {
      console.warn("Regular final timestamp check crashed due to:", error);
    }
    setTimeout(
      regularPublishFinalityStatus,
      regularPublishFinalityStatusInterval
    );
  };
  setTimeout(regularPublishFinalityStatus, 0);

  // regularly publish information about validators, proposals, staking pools, and online nodes
  const regularPublishNetworkInfo = async () => {
    console.log("Starting regular network info publishing...");
    try {
      if (wamp.session) {
        const epochStats = await queryEpochStats();

        currentValidators = epochStats.currentValidators;

        stakingNodes = await extendWithTelemetryInfo([
          ...epochStats.stakingNodes.values(),
        ]);

        const onlineValidatingNodes = pickOnlineValidatingNode(
          stakingNodes.filter(
            (i) => i.stakingStatus && i.stakingStatus !== "proposal"
          )
        );

        const onlineNodes = await queryOnlineNodes();

        if (stakingPoolsInfo) {
          stakingNodes.forEach((validator) => {
            const stakingPoolInfo = stakingPoolsInfo.get(validator.account_id);
            if (stakingPoolInfo) {
              validator.fee = stakingPoolInfo.fee;
              validator.delegatorsCount = stakingPoolInfo.delegatorsCount;
              validator.currentStake = stakingPoolInfo.currentStake;
              validator.poolDetails = stakingPoolsMetadataInfo.get(
                validator.account_id
              );

              // '!validator.stakingStatus' occured at the first start
              // when we query all pool accounts from database.
              // Before this moment we'll have the validators with statuses
              // 'active', 'joining', 'leaving' and 'proposal'.
              // So here we set, check and regulary re-check is validators
              // still has those statuses
              if (
                !validator.stakingStatus ||
                nonValidatingNodeStatuses.indexOf(validator.stakingStatus) >= 0
              ) {
                if (
                  new BN(validator.currentStake).gt(
                    new BN(epochStats.seatPrice)
                  )
                ) {
                  validator.stakingStatus = "on-hold";
                } else if (
                  new BN(validator.currentStake).gte(
                    new BN(epochStats.seatPrice).muln(20).divn(100)
                  )
                ) {
                  validator.stakingStatus = "newcomer";
                } else if (
                  new BN(validator.currentStake).lt(
                    new BN(epochStats.seatPrice).muln(20).divn(100)
                  )
                ) {
                  validator.stakingStatus = "idle";
                }
              }
            }
          });
        }

        wampPublish(
          "nodes",
          {
            onlineNodes,
            currentValidators,
            onlineValidatingNodes,
            stakingNodes,
          },
          wamp
        );
        wampPublish(
          "network-stats",
          {
            currentValidatorsCount: currentValidators.length,
            onlineNodesCount: onlineNodes.length,
            epochLength: epochStats.epochLength,
            epochStartHeight: epochStats.epochStartHeight,
            epochProtocolVersion: epochStats.epochProtocolVersion,
            totalStake: epochStats.totalStake,
            seatPrice: epochStats.seatPrice,
            genesisTime: epochStats.genesisTime,
            genesisHeight: epochStats.genesisHeight,
          },
          wamp
        );
      }
      console.log("Regular network info publishing is completed.");
    } catch (error) {
      console.warn("Regular network info publishing crashed due to:", error);
    }
    setTimeout(regularPublishNetworkInfo, regularPublishNetworkInfoInterval);
  };
  setTimeout(regularPublishNetworkInfo, 0);

  // Periodic check of validators' metadata info (country, country_flag, etc.)
  // This query works only for 'mainnet'
  function startRegularFetchStakingPoolsMetadataInfo() {
    const regularFetchStakingPoolsMetadataInfo = async () => {
      console.log(`Starting regular fetching staking pools metadata info...`);
      try {
        const queryRowsCount = 100;
        const fetchPoolsMetadataInfo = (counter = 0) => {
          return nearRpc.callViewMethod("name.near", "get_all_fields", {
            from_index: counter,
            limit: queryRowsCount,
          });
        };
        let metadataInfo = await fetchPoolsMetadataInfo();

        for (
          let i = 0;
          Object.keys(metadataInfo).length !== 0;
          i += queryRowsCount
        ) {
          metadataInfo = await fetchPoolsMetadataInfo(i);

          Object.keys(metadataInfo).map((account_id) => {
            stakingPoolsMetadataInfo.set(account_id, {
              ...metadataInfo[account_id],
            });
          });
        }
      } catch (error) {
        console.warn(
          "Regular fetching staking pools metadata info crashed due to:",
          error
        );
      }
      setTimeout(
        regularFetchStakingPoolsMetadataInfo,
        regularFetchStakingPoolsMetadataInfoInterval
      );
    };
    setTimeout(regularFetchStakingPoolsMetadataInfo, 0);
  }

  // Periodic check of validators' staking pool fee and delegators count
  const regularFetchStakingPoolsInfo = async () => {
    try {
      if (stakingNodes.length > 0) {
        for (let i = 0; i < stakingNodes.length; i++) {
          const {
            account_id,
            stakingStatus,
            currentStake: activeNodeStake,
          } = stakingNodes[i];

          try {
            let currentStake = activeNodeStake;
            const account = await nearRpc.query({
              request_type: "view_account",
              account_id: account_id,
              finality: "final",
            });

            // query and update 'currentStake' for 'on-hold', 'newcomer' and 'idle' nodes
            // because other nodes receive 'currentStake' from 'queryEpochStats()'
            if (
              !stakingStatus ||
              nonValidatingNodeStatuses.indexOf(stakingStatus) >= 0
            ) {
              currentStake = await nearRpc
                .callViewMethod(account_id, "get_total_staked_balance", {})
                .catch((_error) => {
                  // for some accounts on 'testnet' we can't get 'currentStake'
                  // because they looks like pool accounts but they are not so
                  // that's why we catch this error to avoid unnecessary errors in console
                  return null;
                });
            }

            // 'code_hash' === 11111111111111111111111111111111 is when the validator
            // does not have a staking-pool contract on it (common on testnet)
            if (account.code_hash === "11111111111111111111111111111111") {
              stakingPoolsInfo.set(account_id, {
                fee: null,
                delegatorsCount: null,
                currentStake,
              });
            } else {
              const fee = await nearRpc
                .callViewMethod(account_id, "get_reward_fee_fraction", {})
                .catch((_error) => {
                  // for some accounts on 'testnet' we can't get 'fee'
                  // because they looks like pool accounts but they are not so
                  // that's why we catch this error to avoid unnecessary errors in console
                  return null;
                });
              const delegatorsCount = await nearRpc
                .callViewMethod(account_id, "get_number_of_accounts", {})
                .catch((_error) => {
                  // for some accounts on 'testnet' we can't get 'delegatorsCount'
                  // because they looks like pool accounts but they are not so
                  // that's why we catch this error to avoid unnecessary errors in console
                  return null;
                });
              stakingPoolsInfo.set(account_id, {
                fee,
                delegatorsCount,
                currentStake,
              });
            }
          } catch (error) {
            console.warn(
              `Regular fetching staking pool ${account_id} info crashed due to:`,
              error
            );
          }
        }
      }
    } catch (error) {
      console.warn(
        "Regular fetching staking pools info crashed due to:",
        error
      );
    }
    setTimeout(
      regularFetchStakingPoolsInfo,
      regularFetchStakingPoolsInfoInterval
    );
  };
  setTimeout(regularFetchStakingPoolsInfo, 0);

  // if (isLegacySyncBackendEnabled) {
  //   await startLegacySync();
  //   await startDataSourceSpecificJobs(wamp, DS_LEGACY_SYNC_BACKEND);
  // }
  if (isIndexerBackendEnabled) {
    startDataSourceSpecificJobs(wamp, DS_INDEXER_BACKEND);
    startStatsAggregation();
  }

  if (wampNearNetworkName === "mainnet") {
    startRegularFetchStakingPoolsMetadataInfo();
  }
}

main();
