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

const pickonlineValidatingNode = (nodes) => {
  let onlineValidatingNodes = nodes.filter(
    (node) => node.nodeInfo !== undefined
  );
  onlineValidatingNodes = onlineValidatingNodes.map((node) => {
    return { accountId: node.account_id, ...node.nodeInfo };
  });
  return onlineValidatingNodes;
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

const queryDashboardBlocksAndTxs = async (wamp) => {
  let [transactions, blocks] = await Promise.all([
    wampSqlSelectQueryRows(
      [
        `SELECT hash, signer_id as signerId, receiver_id as receiverId, 
              block_hash as blockHash, block_timestamp as blockTimestamp, transaction_index as transactionIndex
          FROM transactions
          ORDER BY block_timestamp DESC, transaction_index DESC
          LIMIT 10`,
      ],
      wamp
    ),
    wampSqlSelectQueryRows(
      [
        `SELECT blocks.*, COUNT(transactions.hash) as transactionsCount
          FROM (
            SELECT blocks.hash, blocks.height, blocks.timestamp, blocks.prev_hash as prevHash 
            FROM blocks
            ORDER BY blocks.height DESC
            LIMIT 8
          ) as blocks
          LEFT JOIN transactions ON transactions.block_hash = blocks.hash
          GROUP BY blocks.hash
          ORDER BY blocks.timestamp DESC`,
      ],
      wamp
    ),
  ]);
  await Promise.all(
    transactions.map(async (transaction) => {
      const actions = await wampSqlSelectQueryRows(
        [
          `SELECT transaction_hash, action_index, action_type as kind, action_args as args
      FROM actions
      WHERE transaction_hash = :hash
      ORDER BY action_index`,
          {
            hash: transaction.hash,
          },
        ],
        wamp
      );
      transaction.actions = actions.map((action) => {
        return {
          kind: action.kind,
          args: JSON.parse(action.args),
        };
      });
    })
  );
  return { transactions, blocks };
};

exports.queryOnlineNodes = queryOnlineNodes;
exports.addNodeInfo = addNodeInfo;
exports.aggregateStats = aggregateStats;
exports.pickonlineValidatingNode = pickonlineValidatingNode;
exports.queryDashboardBlocksAndTxs = queryDashboardBlocksAndTxs;
