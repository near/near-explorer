const models = require("../models");
const {
  backupDbOnReset,
  regularCheckGenesisInterval,
  regularSyncNewNearcoreStateInterval,
  regularSyncMissingNearcoreStateInterval,
  regularSyncGenesisStateInterval,
  regularQueryRPCInterval,
  regularQueryStatsInterval,
  regularCheckNodeStatusInterval,
  wampNearNetworkName,
} = require("./config");

const { nearRpc, queryFinalTimestamp, queryNodeStats } = require("./near");

const {
  syncNewNearcoreState,
  syncMissingNearcoreState,
  syncGenesisState,
} = require("./sync");

const { setupWamp, wampPublish } = require("./wamp");

const { aggregateStats, addNodeInfo, queryOnlineNodes } = require("./db-utils");

async function main() {
  console.log("Starting NEAR Explorer backend service...");

  await models.sequelize.sync();

  let genesisHeight, genesisTime;
  const regularCheckGenesis = async () => {
    try {
      const genesisConfig = await nearRpc.sendJsonRpc(
        "EXPERIMENTAL_genesis_config"
      );
      if (
        (genesisHeight && genesisHeight !== genesisConfig.genesis_height) ||
        (genesisTime && genesisTime !== genesisConfig.genesis_time)
      ) {
        console.log(
          `Genesis has changed (height ${genesisHeight} -> ${genesisConfig.genesis_height}; \
          time ${genesisTime} -> ${genesisConfig.genesis_time}). \
          We are resetting the database and shutting down the backend to let it auto-start and \
          sync from scratch.`
        );
        models.resetDatabase({ saveBackup: backupDbOnReset });
        process.exit(0);
      }
      genesisHeight = genesisConfig.genesis_height;
      genesisTime = genesisConfig.genesis_time;
    } catch (error) {
      console.warn("Regular checking Genesis crashed due to:", error);
    }
    setTimeout(regularCheckGenesis, regularCheckGenesisInterval);
  };
  setTimeout(regularCheckGenesis, 0);

  const regularSyncGenesisState = async () => {
    try {
      await syncGenesisState();
    } catch (error) {
      console.warn("Regular syncing Genesis state crashed due to:", error);
    }
    setTimeout(regularSyncGenesisState, regularSyncGenesisStateInterval);
  };
  setTimeout(regularSyncGenesisState, 0);

  // TODO: we should publish (push) the information about the new blocks/transcations via WAMP.
  const regularSyncNewNearcoreState = async () => {
    try {
      await syncNewNearcoreState();
    } catch (error) {
      console.warn("Regular syncing new Nearcore state crashed due to:", error);
    }
    setTimeout(
      regularSyncNewNearcoreState,
      regularSyncNewNearcoreStateInterval
    );
  };
  setTimeout(regularSyncNewNearcoreState, 0);

  const regularSyncMissingNearcoreState = async () => {
    try {
      await syncMissingNearcoreState();
    } catch (error) {
      console.warn(
        "Regular syncing missing Nearcore state crashed due to:",
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

  const wamp = setupWamp();
  console.log("Starting WAMP worker...");
  wamp.open();

  // regular check finalTimesamp and publish to final-timestamp uri
  const regularCheckFinalTimestamp = async () => {
    try {
      if (wamp.session) {
        const finalTimestamp = await queryFinalTimestamp();
        wampPublish("final-timestamp", [finalTimestamp], wamp);
      }
    } catch (error) {
      console.warn("Regular querying RPC crashed due to:", error);
    }
    setTimeout(regularCheckFinalTimestamp, regularQueryRPCInterval);
  };
  setTimeout(regularCheckFinalTimestamp, 0);

  // regular check block/tx data stats and publish to data-stats uri
  const regularCheckDataStats = async () => {
    try {
      if (wamp.session) {
        const dataStats = await aggregateStats(wamp);
        wampPublish("data-stats", [{ dataStats }], wamp);
      }
    } catch (error) {
      console.warn("Regular querying data stats crashed due to:", error);
    }
    setTimeout(regularCheckDataStats, regularQueryStatsInterval);
  };
  setTimeout(regularCheckDataStats, 0);

  // regular check node status and publish to nodes uri
  const regularCheckNodeStatus = async () => {
    try {
      if (wamp.session) {
        let { currentValidators, proposals } = await queryNodeStats();
        let validators = await addNodeInfo(currentValidators, wamp);
        let onlineNodes = await queryOnlineNodes(wamp);
        if (!onlineNodes) {
          onlineNodes = [];
        }
        wampPublish("nodes", [{ onlineNodes, validators, proposals }], wamp);
        wampPublish(
          "node-stats",
          [
            {
              validatorAmount: validators.length,
              onlineNodeAmount: onlineNodes.length,
              proposalAmount: proposals.length,
            },
          ],
          wamp
        );
      }
    } catch (error) {
      console.warn("Regular querying nodes amount crashed due to:", error);
    }
    setTimeout(regularCheckNodeStatus, regularCheckNodeStatusInterval);
  };
  setTimeout(regularCheckNodeStatus, 0);

  // test part for postgres database
  const wampQueryPostgres = async () => {
    try {
      if (wamp) {
        const uri = `com.nearprotocol.${wampNearNetworkName}.explorer.select-postgres`;
        const args = [`SELECT COUNT(*) from transactions`];
        const res = await wamp.session.call(uri, args);
        console.log(res[0]);
      }
    } catch (error) {
      console.warn("querying postgres is crashed due to:", error);
    }
    setTimeout(wampQueryPostgres, 1000);
  };
  setTimeout(wampQueryPostgres, 0);
}

main();
