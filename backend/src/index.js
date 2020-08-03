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

  //set up wamp
  const wamp = setupWamp();
  console.log("Starting WAMP worker...");
  wamp.open();

  // wamp function
  const wampPublish = (topic, args) => {
    const uri = `com.nearprotocol.${wampNearNetworkName}.explorer.${topic}`;
    wamp.session.publish(uri, args);
  };

  const wampSqlSelectQueryCount = async (args) => {
    const uri = `com.nearprotocol.${wampNearNetworkName}.explorer.select`;
    const res = await wamp.session.call(uri, args);
    return res[0];
  };

  const wampSqlSelectQueryRows = async (args) => {
    const uri = `com.nearprotocol.${wampNearNetworkName}.explorer.select`;
    return await wamp.session.call(uri, args);
  };

  // regular check finalTimesamp and publish to final-timestamp uri
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

  // regular check block/tx data stats and publish to data-stats uri
  const totalStats = async () => {
    const [
      totalBlocks,
      totalTransactions,
      totalAccounts,
      lastDayTxCount,
      lastBlockHeight,
    ] = await Promise.all([
      wampSqlSelectQueryCount([`SELECT COUNT(*) as total FROM blocks`]),
      wampSqlSelectQueryCount([`SELECT COUNT(*) as total FROM transactions`]),
      wampSqlSelectQueryCount([`SELECT COUNT(*) as total FROM accounts`]),
      wampSqlSelectQueryCount([
        `SELECT COUNT(*) as total FROM transactions
        WHERE block_timestamp > (strftime('%s','now') - 60 * 60 * 24) * 1000`,
      ]),
      wampSqlSelectQueryCount([
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

  // regular check node status and publish to nodes uri
  const addNodeInfo = async (nodes) => {
    const accountArray = nodes.map((node) => node.account_id);
    let nodesInfo = await wampSqlSelectQueryRows([
      `SELECT ip_address as ipAddress, account_id as accountId, node_id as nodeId, 
        last_seen as lastSeen, last_height as lastHeight,status,
        agent_name as agentName, agent_version as agentVersion, agent_build as agentBuild
              FROM nodes
              WHERE account_id IN (:accountArray)
              ORDER BY node_id DESC
          `,
      {
        accountArray,
      },
    ]);
    let nodeMap = new Map();
    if (nodesInfo && nodesInfo.length > 0) {
      for (let i = 0; i < nodesInfo.length; i++) {
        const { accountId, ...nodeInfo } = nodesInfo[i];
        nodeMap.set(accountId, nodeInfo);
      }
    }

    for (let i = 0; i < nodes.length; i++) {
      nodes[i].nodeInfo = nodeMap.get(nodes[i].account_id);
    }

    return nodes;
  };

  const regularCheckNodeStatus = async () => {
    try {
      if (wamp.session) {
        let { currentValidators, proposals } = await queryNodeStats();
        let validators = await addNodeInfo(currentValidators);
        let onlineNodes = await wampSqlSelectQueryRows([
          `SELECT ip_address as ipAddress, account_id as accountId, node_id as nodeId, 
          last_seen as lastSeen, last_height as lastHeight,status,
          agent_name as agentName, agent_version as agentVersion, agent_build as agentBuild
                FROM nodes
                WHERE last_seen > (strftime('%s','now') - 60) * 1000
                ORDER BY is_validator ASC, node_id DESC
            `,
        ]);
        if (!onlineNodes) {
          onlineNodes = [];
        }
        wampPublish("nodes", [{ onlineNodes, validators, proposals }]);
        wampPublish("node-stats", [
          {
            validatorAmount: validators.length,
            onlineNodeAmount: onlineNodes.length,
            proposalAmount: proposals.length,
          },
        ]);
      }
    } catch (error) {
      console.warn("Regular querying nodes amount crashed due to:", error);
    }
    setTimeout(regularCheckNodeStatus, regularCheckNodeStatusInterval);
  };
  setTimeout(regularCheckNodeStatus, 0);
}

main();
