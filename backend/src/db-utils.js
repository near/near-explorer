const { wampSqlSelectQueryCount, wampSqlSelectQueryRows } = require("./wamp");

const aggregateStats = async (wamp) => {
  const [
    totalBlocks,
    totalTransactions,
    totalAccounts,
    lastDayTxCount,
    lastBlockHeight,
  ] = await Promise.all([
    wampSqlSelectQueryCount([`SELECT COUNT(*) as total FROM blocks`], wamp),
    wampSqlSelectQueryCount(
      [`SELECT COUNT(*) as total FROM transactions`],
      wamp
    ),
    wampSqlSelectQueryCount([`SELECT COUNT(*) as total FROM accounts`], wamp),
    wampSqlSelectQueryCount(
      [
        `SELECT COUNT(*) as total FROM transactions
        WHERE block_timestamp > (strftime('%s','now') - 60 * 60 * 24) * 1000`,
      ],
      wamp
    ),
    wampSqlSelectQueryCount(
      [`SELECT height FROM blocks ORDER BY height DESC LIMIT 1`],
      wamp
    ),
  ]);
  return {
    totalAccounts: totalAccounts.total,
    totalBlocks: totalBlocks.total,
    totalTransactions: totalTransactions.total,
    lastDayTxCount: lastDayTxCount.total,
    lastBlockHeight: lastBlockHeight.height,
  };
};

const addNodeInfo = async (nodes, wamp) => {
  const accountArray = nodes.map((node) => node.account_id);
  let nodesInfo = await wampSqlSelectQueryRows(
    [
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
    ],
    wamp
  );
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

const queryOnlineNodes = async (wamp) => {
  return await wampSqlSelectQueryRows(
    [
      `SELECT ip_address as ipAddress, account_id as accountId, node_id as nodeId, 
      last_seen as lastSeen, last_height as lastHeight,status,
      agent_name as agentName, agent_version as agentVersion, agent_build as agentBuild,
      latitude, longitude, city
            FROM nodes
            WHERE last_seen > (strftime('%s','now') - 60) * 1000
            ORDER BY is_validator ASC, node_id DESC
        `,
    ],
    wamp
  );
};

exports.queryOnlineNodes = queryOnlineNodes;
exports.addNodeInfo = addNodeInfo;
exports.aggregateStats = aggregateStats;
