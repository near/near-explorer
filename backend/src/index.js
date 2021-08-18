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
  regularCalculateCirculatingSupplyInterval,
  wampNearNetworkName,
  regularFetchStakingPoolsMetadataInfoInterval,
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
  queryDashboardTransactionsStats,
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

const { calculateCirculatingSupply } = require("./aggregations");

let currentValidators = [];
let stakingNodes = [];
let stakingPoolsInfo = new Map();
let stakingPoolsMetadataInfo = new Map();

async function startLegacySync() {
  console.log("Starting NEAR Explorer legacy syncing service...");

  let genesisHeight, genesisTime, genesisChainId;

  const SyncGenesisState = async () => {
    console.log("Starting Genesis state sync...");
    try {
      await syncGenesisState();
    } catch (error) {
      console.warn("Genesis state crashed due to:", error);
    }
  };

  const syncedGenesis = await getSyncedGenesis();
  if (syncedGenesis) {
    genesisHeight = syncedGenesis.genesisHeight;
    genesisTime = syncedGenesis.genesisTime;
    genesisChainId = syncedGenesis.chainId;
  } else {
    setTimeout(SyncGenesisState, 0);
  }

  const regularCheckGenesis = async () => {
    console.log("Starting regular Genesis check...");
    try {
      const genesisConfig = await nearRpc.sendJsonRpc(
        "EXPERIMENTAL_genesis_config"
      );
      const genesisConfigGenesisTime = moment(
        genesisConfig.genesis_time
      ).valueOf();
      if (
        (genesisHeight &&
          genesisHeight !== genesisConfig.genesis_height.toString()) ||
        (genesisTime && genesisTime !== genesisConfigGenesisTime) ||
        (genesisChainId && genesisChainId !== genesisConfig.chain_id)
      ) {
        console.log(
          `Genesis has changed (height ${genesisHeight} -> ${genesisConfig.genesis_height}; \
          time ${genesisTime} -> ${genesisConfigGenesisTime}; chain id ${genesisChainId} -> \
          ${genesisConfig.chain_id}). We are resetting the database and shutting down the backend \
          to let it auto-start and sync from scratch.`
        );
        models.resetDatabase({ saveBackup: backupDbOnReset });
        process.exit(0);
      }
      genesisHeight = genesisConfig.genesis_height.toString();
      genesisTime = genesisConfigGenesisTime;
      console.log("Regular Genesis check is completed.");
    } catch (error) {
      console.warn("Regular Genesis check crashed due to:", error);
    }
    setTimeout(regularCheckGenesis, regularCheckGenesisInterval);
  };
  setTimeout(regularCheckGenesis, 0);

  const regularSyncNewNearcoreState = async () => {
    console.log("Starting regular new nearcore state sync...");
    try {
      await syncNewNearcoreState();
      console.log("Regular new nearcore state sync is completed.");
    } catch (error) {
      console.warn("Regular new nearcore state sync crashed due to:", error);
    }
    setTimeout(
      regularSyncNewNearcoreState,
      regularSyncNewNearcoreStateInterval
    );
  };
  setTimeout(regularSyncNewNearcoreState, 0);

  const regularSyncMissingNearcoreState = async () => {
    console.log("Starting regular missing nearcore state sync...");
    try {
      await syncMissingNearcoreState();
      console.log("Regular missing nearcore state sync is completed.");
    } catch (error) {
      console.warn(
        "Regular missing nearcore state sync crashed due to:",
        error
      );
    }
    setTimeout(
      regularSyncMissingNearcoreState,
      regularSyncMissingNearcoreStateInterval
    );
  };
  setTimeout(
    regularSyncMissingNearcoreState,
    regularSyncMissingNearcoreStateInterval
  );
}

function getDataSourceSpecificTopicName(baseTopicName, dataSource) {
  const defaultBackend = DS_LEGACY_SYNC_BACKEND;
  if (dataSource === defaultBackend) {
    return baseTopicName;
  }
  return `${baseTopicName}:${dataSource}`;
}

function startDataSourceSpecificJobs(wamp, dataSource) {
  const regularCheckDataStats = async () => {
    console.log(`Starting regular data stats check from ${dataSource}...`);
    try {
      if (wamp.session) {
        const [blocksStats, transactionsStats] = await Promise.all([
          queryDashboardBlocksStats({ dataSource }),
          queryDashboardTransactionsStats({ dataSource }),
        ]);
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
          transactionsStats,
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

function startRegularCalculationCirculatingSupply() {
  const regularCalculateCirculatingSupply = async () => {
    console.log(`Starting regular calculation of circulating supply...`);
    try {
      await calculateCirculatingSupply();
    } catch (error) {
      console.warn(
        "regular calculation of circulating supply is crashed due to:",
        error
      );
    }
    setTimeout(
      regularCalculateCirculatingSupply,
      regularCalculateCirculatingSupplyInterval
    );
  };
  setTimeout(regularCalculateCirculatingSupply, 0);
}

async function main() {
  console.log("Starting Explorer backend...");

  await models.sequelizeLegacySyncBackend.sync();

  const wamp = setupWamp();
  console.log("Starting WAMP worker...");
  wamp.open();

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
      console.warn("Regular final timestamp check  crashed due to:", error);
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

              if (!validator.stakingStatus) {
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
      console.log("Regular regular network info publishing is completed.");
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
          const { account_id, currentStake: currentNodeStake } = stakingNodes[
            i
          ];

          try {
            const account = await nearRpc.query({
              request_type: "view_account",
              account_id: account_id,
              finality: "final",
            });

            const currentStake =
              currentNodeStake ??
              (await nearRpc.callViewMethod(
                account_id,
                "get_total_staked_balance",
                {}
              ));

            if (account.code_hash === "11111111111111111111111111111111") {
              stakingPoolsInfo.set(account_id, {
                fee: null,
                delegatorsCount: null,
                currentStake,
              });
            } else {
              const fee = await nearRpc.callViewMethod(
                account_id,
                "get_reward_fee_fraction",
                {}
              );
              const delegatorsCount = await nearRpc.callViewMethod(
                account_id,
                "get_number_of_accounts",
                {}
              );
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

  if (isLegacySyncBackendEnabled) {
    await startLegacySync();
    await startDataSourceSpecificJobs(wamp, DS_LEGACY_SYNC_BACKEND);
  }
  if (isIndexerBackendEnabled) {
    await startDataSourceSpecificJobs(wamp, DS_INDEXER_BACKEND);
    await startStatsAggregation();
  }

  if (wampNearNetworkName === "mainnet") {
    startRegularCalculationCirculatingSupply();
    startRegularFetchStakingPoolsMetadataInfo();
  }
}

main();
