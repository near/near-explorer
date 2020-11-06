const { DS_INDEXER_BACKEND } = require("./consts");
const models = require("../models");

const query = async ([query, replacements], { dataSource }) => {
  const sequelize =
    dataSource === DS_INDEXER_BACKEND
      ? models.sequelizeIndexerBackendReadOnly
      : models.sequelizeLegacySyncBackendReadOnly;
  return await sequelize.query(query, {
    replacements,
    type: models.Sequelize.QueryTypes.SELECT,
  });
};

const querySingleRow = async (args, options) => {
  const result = await query(args, options || {});
  return result[0];
};

const queryRows = async (args, options) => {
  return await query(args, options || {});
};

const getSyncedGenesis = async (options) => {
  return await querySingleRow(
    [
      `SELECT genesis_time as genesisTime, genesis_height as genesisHeight, chain_id as chainId FROM genesis`,
    ],
    options
  );
};

const aggregateStats = async (options) => {
  async function queryLastDayTxCount({ dataSource }) {
    let query;
    if (dataSource === DS_INDEXER_BACKEND) {
      query = `SELECT COUNT(*) as total FROM transactions
        WHERE block_timestamp > (extract(MILLISECONDS from now()) - 60 * 60 * 24) * 1000`;
    } else {
      query = `SELECT COUNT(*) as total FROM transactions
        WHERE block_timestamp > (strftime('%s','now') - 60 * 60 * 24) * 1000`;
    }
    return await querySingleRow([query], { dataSource });
  }
  const [
    totalBlocks,
    totalTransactions,
    totalAccounts,
    lastDayTxCount,
    lastBlockHeight,
  ] = await Promise.all([
    querySingleRow([`SELECT COUNT(*) as total FROM blocks`], options),
    querySingleRow([`SELECT COUNT(*) as total FROM transactions`], options),
    querySingleRow([`SELECT COUNT(*) as total FROM accounts`], options),
    queryLastDayTxCount(options),
    querySingleRow(
      [`SELECT height FROM blocks ORDER BY height DESC LIMIT 1`],
      options
    ),
  ]);
  return {
    totalAccounts: totalAccounts.total,
    totalBlocks: totalBlocks.total,
    totalTransactions: totalTransactions.total,
    lastDayTxCount: lastDayTxCount.total,
    lastBlockHeight: lastBlockHeight ? lastBlockHeight.height : 0,
  };
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

const queryDashboardBlocksAndTxs = async ({ dataSource }) => {
  const transactionHashColumnName =
    dataSource === DS_INDEXER_BACKEND ? "transaction_hash" : "hash";
  const transactionIndexColumnName =
    dataSource === DS_INDEXER_BACKEND ? "index_in_chunk" : "transaction_index";
  let [transactions, blocks] = await Promise.all([
    queryRows(
      [
        `SELECT ${transactionHashColumnName} as hash, signer_id as signerId, receiver_id as receiverId, 
              block_hash as blockHash, block_timestamp as blockTimestamp, ${transactionIndexColumnName} as transactionIndex
          FROM transactions
          ORDER BY block_timestamp DESC, ${transactionIndexColumnName} DESC
          LIMIT 10`,
      ],
      { dataSource }
    ),
    queryRows(
      [
        `SELECT blocks.hash, blocks.height, blocks.timestamp, blocks.prev_hash as prevHash, COUNT(transactions.${transactionHashColumnName}) as transactionsCount
          FROM (
            SELECT blocks.hash
            FROM blocks
            ORDER BY blocks.height DESC
            LIMIT 8
          ) as recent_blocks
          LEFT JOIN blocks ON blocks.hash = recent_blocks.hash
          LEFT JOIN transactions ON transactions.block_hash = recent_blocks.hash
          GROUP BY blocks.hash
          ORDER BY blocks.timestamp DESC`,
      ],
      { dataSource }
    ),
  ]);
  let query;
  let transactionHashes = transactions.map((transaction) => transaction.hash);
  if (dataSource === DS_INDEXER_BACKEND) {
    query = `SELECT transaction_hash, index as action_index, action_kind as kind, args
              FROM transaction_actions
              WHERE transaction_hash IN (:transactionHashes)
              ORDER BY index`;
  } else {
    query = `SELECT transaction_hash, action_index, action_type as kind, action_args as args
              FROM actions
              WHERE transaction_hash IN (:transactionHashes)
              ORDER BY action_index`;
  }
  const actionsArray = await queryRows([query, { transactionHashes }], {
    dataSource,
  });
  const actionsByTransactionHash = new Map();
  actionsArray.forEach((action) => {
    const transactionActions = actionsByTransactionHash.get(
      action.transaction_hash
    );
    if (transactionActions) {
      transactionActions.push(action);
    } else {
      actionsByTransactionHash.set(action.transaction_hash, [action]);
    }
  });
  transactions.map((transaction) => {
    const transactionActions = actionsByTransactionHash.get(transaction.hash);
    if (transactionActions) {
      transaction.actions = transactionActions.map((action) => {
        return {
          kind: action.kind,
          args: JSON.parse(action.args),
        };
      });
    }
  });
  return { transactions, blocks };
};

exports.queryOnlineNodes = queryOnlineNodes;
exports.addNodeInfo = addNodeInfo;
exports.aggregateStats = aggregateStats;
exports.pickOnlineValidatingNode = pickOnlineValidatingNode;
exports.queryDashboardBlocksAndTxs = queryDashboardBlocksAndTxs;
exports.getSyncedGenesis = getSyncedGenesis;
