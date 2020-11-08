const models = require("../models");

const query = async ([query, replacements], from_indexer = false) => {
  if (from_indexer) {
    return await models.sequelizePostgres.query(query, {
      replacements,
      type: models.Sequelize.QueryTypes.SELECT,
    });
  }
  return await models.sequelizeReadOnly.query(query, {
    replacements,
    type: models.Sequelize.QueryTypes.SELECT,
  });
};

const querySingleRow = async (args, from_indexer = false) => {
  const result = await query(args, from_indexer);
  return result[0];
};

const queryRows = async (args, from_indexer = false) => {
  return await query(args, from_indexer);
};

const getSyncedGenesis = async (from_indexer = false) => {
  return await querySingleRow(
    [
      `SELECT genesis_time as genesisTime, genesis_height as genesisHeight, chain_id as chainId FROM genesis`,
    ],
    from_indexer
  );
};

const queryDashboardBlockInfo = async (from_indexer = false) => {
  async function queryLastMinuteBlocks(from_indexer) {
    let query;
    if (from_indexer) {
      query = `SELECT COUNT(*) as total FROM blocks
        WHERE timestamp > (extract(epoch from now()) - 60) * 1000000000`;
    } else {
      query = `SELECT COUNT(*) as total FROM blocks
        WHERE timestamp > (strftime('%s','now') - 60) * 1000`;
    }
    return await querySingleRow([query], from_indexer);
  }

  const [lastBlockHeight, lastGasPrice, lastMinuteBlocks] = await Promise.all([
    querySingleRow(
      [`SELECT height FROM blocks ORDER BY height DESC LIMIT 1`],
      from_indexer
    ),
    querySingleRow(
      [`SELECT gas_price as price FROM blocks ORDER BY height DESC LIMIT 1`],
      from_indexer
    ),
    queryLastMinuteBlocks(from_indexer),
  ]);
  return {
    lastBlockHeight: lastBlockHeight ? lastBlockHeight.height : 0,
    lastGasPrice: lastGasPrice.price,
    lastMinuteBlocks: lastMinuteBlocks.total,
  };
};

const queryDashboardTxInfo = async (from_indexer = false) => {
  async function queryLastDayTxCount(from_indexer, day = 1) {
    let query;
    if (from_indexer) {
      query = `SELECT COUNT(*) as total FROM transactions
        WHERE block_timestamp > (extract(epoch from now()) - 60 * 60 * 24 * ${day}) * 1000000000`;
    } else {
      query = `SELECT COUNT(*) as total FROM transactions
        WHERE block_timestamp > (strftime('%s','now') - 60 * 60 * 24 * ${day}) * 1000`;
    }
    return await querySingleRow([query], from_indexer);
  }
  let transactionCountArray = new Array(14);
  for (let i = 0; i < transactionCountArray.length; i++) {
    let result = await queryLastDayTxCount(from_indexer, i + 1);
    transactionCountArray[i] = result.total;
  }
  for (let i = transactionCountArray.length - 1; i > 0; i--) {
    transactionCountArray[i] =
      transactionCountArray[i] - transactionCountArray[i - 1];
  }

  return transactionCountArray.reverse();
};

const addNodeInfo = async (nodes) => {
  const accountArray = nodes.map((node) => node.account_id);
  let nodesInfo = await queryRows([
    `SELECT ip_address as ipAddress, account_id as accountId, node_id as nodeId, 
        last_seen as lastSeen, last_height as lastHeight,status,
        agent_name as agentName, agent_version as agentVersion, agent_build as agentBuild,
        latitude, longitude, city
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

const pickOnlineValidatingNode = (nodes) => {
  let onlineValidatingNodes = nodes.filter(
    (node) => node.nodeInfo !== undefined
  );
  onlineValidatingNodes = onlineValidatingNodes.map((node) => {
    return { accountId: node.account_id, ...node.nodeInfo };
  });
  return onlineValidatingNodes;
};

const queryOnlineNodes = async () => {
  return await queryRows([
    `SELECT ip_address as ipAddress, account_id as accountId, node_id as nodeId, 
      last_seen as lastSeen, last_height as lastHeight,status,
      agent_name as agentName, agent_version as agentVersion, agent_build as agentBuild,
      latitude, longitude, city
            FROM nodes
            WHERE last_seen > (strftime('%s','now') - 60) * 1000
            ORDER BY is_validator ASC, node_id DESC
        `,
  ]);
};

exports.queryOnlineNodes = queryOnlineNodes;
exports.addNodeInfo = addNodeInfo;
exports.pickOnlineValidatingNode = pickOnlineValidatingNode;

exports.queryDashboardTxInfo = queryDashboardTxInfo;
exports.queryDashboardBlockInfo = queryDashboardBlockInfo;

exports.getSyncedGenesis = getSyncedGenesis;
