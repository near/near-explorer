const moment = require("moment");

const models = require("../models");
const {
  isLegacySyncBackendEnabled,
  isIndexerBackendEnabled,
  backupDbOnReset,
  regularCheckGenesisInterval,
  regularSyncNewNearcoreStateInterval,
  regularSyncMissingNearcoreStateInterval,
  regularQueryRPCInterval,
  regularQueryStatsInterval,
  regularCheckNodeStatusInterval,
  regularStatsInterval,
} = require("./config");
const { DS_LEGACY_SYNC_BACKEND, DS_INDEXER_BACKEND } = require("./consts");

const { nearRpc, queryFinalTimestamp, queryNodeStats } = require("./near");

const {
  syncNewNearcoreState,
  syncMissingNearcoreState,
  syncGenesisState,
} = require("./sync");

const { setupWamp, wampPublish } = require("./wamp");

const {
  addNodeInfo,
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

async function main() {
  console.log("Starting Explorer backend...");

  await models.sequelizeLegacySyncBackend.sync();

  const wamp = setupWamp();
  console.log("Starting WAMP worker...");
  wamp.open();

  // regular check finalTimesamp and publish to final-timestamp uri
  const regularCheckFinalTimestamp = async () => {
    console.log("Starting regular final timestamp check...");
    try {
      if (wamp.session) {
        const finalTimestamp = await queryFinalTimestamp();
        wampPublish("final-timestamp", { finalTimestamp }, wamp);
      }
      console.log("Regular final timestamp check is completed.");
    } catch (error) {
      console.warn("Regular final timestamp check  crashed due to:", error);
    }
    setTimeout(regularCheckFinalTimestamp, regularQueryRPCInterval);
  };
  setTimeout(regularCheckFinalTimestamp, 0);

  // regular check node status and publish to nodes uri
  const regularCheckNodeStatus = async () => {
    console.log("Starting regular node status check...");
    try {
      if (wamp.session) {
        let { currentValidators, proposals } = await queryNodeStats();
        let validators = await addNodeInfo(currentValidators);
        let onlineValidatingNodes = pickOnlineValidatingNode(validators);
        let onlineNodes = await queryOnlineNodes();
        if (!onlineNodes) {
          onlineNodes = [];
        }
        wampPublish(
          "nodes",
          { onlineNodes, validators, proposals, onlineValidatingNodes },
          wamp
        );
        wampPublish(
          "node-stats",
          {
            validatorAmount: validators.length,
            onlineNodeAmount: onlineNodes.length,
            proposalAmount: proposals.length,
          },
          wamp
        );
      }
      console.log("Regular node status check is completed.");
    } catch (error) {
      console.warn("Regular node status check crashed due to:", error);
    }
    setTimeout(regularCheckNodeStatus, regularCheckNodeStatusInterval);
  };
  setTimeout(regularCheckNodeStatus, 0);

  if (isLegacySyncBackendEnabled) {
    await startLegacySync();
    await startDataSourceSpecificJobs(wamp, DS_LEGACY_SYNC_BACKEND);
  }
  if (isIndexerBackendEnabled) {
    await startDataSourceSpecificJobs(wamp, DS_INDEXER_BACKEND);
    await startStatsAggregation();
  }
}

main();
