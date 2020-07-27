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

const { setupWamp } = require("./wamp");

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

  const wampPublish = (topic, args) => {
    const uri = `com.nearprotocol.${wampNearNetworkName}.explorer.${topic}`;
    wamp.session.publish(uri, args);
  };

  const wampSqlSelectQuery = async (args) => {
    const uri = `com.nearprotocol.${wampNearNetworkName}.explorer.select`;
    const res = await wamp.session.call(uri, args);
    return res[0];
  };

  const regularCheckFinalTimestamp = async () => {
    try {
      if (wamp.session) {
        const finalTimestamp = await queryFinalTimestamp();
        wampPublish("final-timestamp", [finalTimestamp]);
      }
    } catch (error) {
      console.warn("Regular querying RPC crashed due to:", error);
    }
    setTimeout(regularCheckFinalTimestamp, regularQueryRPCInterval);
  };
  setTimeout(regularCheckFinalTimestamp, 0);

  const totalStats = async () => {
    const [
      totalBlocks,
      totalTransactions,
      totalAccounts,
      lastDayTxCount,
      lastBlockHeight,
    ] = await Promise.all([
      wampSqlSelectQuery([`SELECT COUNT(*) as total FROM blocks`]),
      wampSqlSelectQuery([`SELECT COUNT(*) as total FROM transactions`]),
      wampSqlSelectQuery([`SELECT COUNT(*) as total FROM accounts`]),
      wampSqlSelectQuery([
        `SELECT COUNT(*) as total FROM transactions
        WHERE block_timestamp > (strftime('%s','now') - 60 * 60 * 24) * 1000`,
      ]),
      wampSqlSelectQuery([
        `SELECT height FROM blocks ORDER BY height DESC LIMIT 1`,
      ]),
    ]);
    return {
      totalAccounts: totalAccounts.total,
      totalBlocks: totalBlocks.total,
      totalTransactions: totalTransactions.total,
      lastDayTxCount: lastDayTxCount.total,
      lastBlockHeight: lastBlockHeight.height,
    };
  };

  const regularCheckDataStats = async () => {
    try {
      if (wamp.session) {
        const dataStats = await totalStats();
        wampPublish("data-stats", [{ dataStats }]);
      }
    } catch (error) {
      console.warn("Regular querying data stats crashed due to:", error);
    }
    setTimeout(regularCheckDataStats, regularQueryStatsInterval);
  };
  setTimeout(regularCheckDataStats, 0);

  const regularCheckNodeStatus = async () => {
    try {
      if (wamp.session) {
        const validatingNodes = await queryNodeStats();
        let onlineNodes = await wampSqlSelectQuery([
          `SELECT ip_address as ipAddress, moniker, account_id as accountId, node_id as nodeId, signature, 
            last_seen as lastSeen, last_height as lastHeight, last_hash as lastHash,
            agent_name as agentName, agent_version as agentVersion, agent_build as agentBuild,
            peer_count as peerCount, is_validator as isValidator, status
                FROM nodes
                WHERE last_seen > (strftime('%s','now') - 60) * 1000
                ORDER BY is_validator ASC, node_id DESC
            `,
        ]);
        if (!onlineNodes) {
          onlineNodes = [];
        }
        wampPublish("nodes", [{ validatingNodes, onlineNodes }]);
      }
    } catch (error) {
      console.warn("Regular querying nodes amount crashed due to:", error);
    }
    setTimeout(regularCheckNodeStatus, 1000);
  };
  setTimeout(regularCheckNodeStatus, 0);
}

main();
