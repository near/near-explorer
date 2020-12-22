const { DS_INDEXER_BACKEND } = require("./consts");
const models = require("../models");
const BN = require("bn.js");

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

//new query for new dashboard
const queryDashboardBlockInfo = async (options) => {
  async function queryLatestBlockHeight({ dataSource }) {
    let query;
    if (dataSource === DS_INDEXER_BACKEND) {
      query = `SELECT block_height FROM blocks ORDER BY block_height DESC LIMIT 1`;
    } else {
      query = `SELECT height AS block_height FROM blocks ORDER BY height DESC LIMIT 1`;
    }
    return await querySingleRow([query], { dataSource });
  }
  async function queryLatestGasPrice({ dataSource }) {
    let query;
    if (dataSource === DS_INDEXER_BACKEND) {
      query = `SELECT gas_price FROM blocks ORDER BY block_height DESC LIMIT 1`;
    } else {
      query = `SELECT gas_price FROM blocks ORDER BY height DESC LIMIT 1`;
    }
    return await querySingleRow([query], { dataSource });
  }
  async function queryLastMinuteBlocks({ dataSource }) {
    let query;
    if (dataSource === DS_INDEXER_BACKEND) {
      query = `SELECT block_timestamp AS latest_block_timestamp FROM blocks ORDER BY block_timestamp DESC LIMIT 1`;
    } else {
      query = `SELECT timestamp AS latest_block_timestamp FROM blocks ORDER BY timestamp DESC LIMIT 1`;
    }
    const latestBlockTimestampOrNone = await querySingleRow([query], {
      dataSource,
    });
    if (!latestBlockTimestampOrNone) {
      return { total: 0 };
    }
    const {
      latest_block_timestamp: latestBlockTimestamp,
    } = latestBlockTimestampOrNone;
    const latestBlockTimestampBN = new BN(latestBlockTimestamp);
    const currentUnixTimeBN = new BN(Math.floor(new Date().getTime() / 1000));
    let latestBlockEpochTimeBN;
    if (dataSource === DS_INDEXER_BACKEND) {
      latestBlockEpochTimeBN = latestBlockTimestampBN.div(new BN("1000000000"));
    } else {
      latestBlockEpochTimeBN = latestBlockTimestampBN.divn(1000);
    }
    // If the latest block is older than 1 minute from now, we report 0
    if (currentUnixTimeBN.sub(latestBlockEpochTimeBN).gtn(60)) {
      return { total: 0 };
    }

    if (dataSource === DS_INDEXER_BACKEND) {
      query = `SELECT COUNT(*) AS total FROM blocks
      WHERE block_timestamp > (cast(EXTRACT(EPOCH FROM NOW()) - 60 as bigint) * 1000 * 1000 * 1000)`;
    } else {
      query = `SELECT COUNT(*) AS total FROM blocks
        WHERE timestamp > (:latestBlockTimestamp - 60 * 1000)`;
    }
    return await querySingleRow(
      [
        query,
        {
          latestBlockTimestamp:
            dataSource == DS_INDEXER_BACKEND
              ? latestBlockEpochTimeBN.toNumber()
              : latestBlockEpochTimeBN.muln(1000).toNumber(),
        },
      ],
      {
        dataSource,
      }
    );
  }
  const [
    lastBlockHeight,
    latestGasPrice,
    lastMinuteBlocks,
  ] = await Promise.all([
    queryLatestBlockHeight(options),
    queryLatestGasPrice(options),
    queryLastMinuteBlocks(options),
  ]);
  return {
    latestBlockHeight: lastBlockHeight ? lastBlockHeight.block_height : 0,
    latestGasPrice: latestGasPrice.gas_price,
    numberOfLastMinuteBlocks: lastMinuteBlocks.total,
  };
};

const queryDashboardTxInfo = async (options) => {
  async function queryTransactionCountArray({ dataSource }) {
    let query;
    if (dataSource === DS_INDEXER_BACKEND) {
      query = `SELECT date_trunc('day', to_timestamp(DIV(block_timestamp, 1000*1000*1000))) as date, count(transaction_hash) as total
                FROM transactions
                WHERE block_timestamp > (cast(EXTRACT(EPOCH FROM NOW()) - 60 * 60 * 24 * 14 as bigint) * 1000 * 1000 * 1000)
                GROUP BY date
                ORDER BY date`;
    } else {
      query = `SELECT strftime('%Y-%m-%d',block_timestamp/1000,'unixepoch') as date, count(hash) as total
                FROM transactions
                WHERE (block_timestamp/1000) > (strftime('%s','now') - 60 * 60 * 24 * 15)
                GROUP BY date
                ORDER BY date`;
    }
    return await queryRows([query], { dataSource });
  }
  let transactionCountArray = await queryTransactionCountArray(options);
  return transactionCountArray;
};

// Old query after refactor finish, we can delete
const queryDashboardBlocksAndTxs = async ({ dataSource }) => {
  const transactionHashColumnName =
    dataSource === DS_INDEXER_BACKEND ? "transaction_hash" : "hash";
  const transactionIndexColumnName =
    dataSource === DS_INDEXER_BACKEND ? "index_in_chunk" : "transaction_index";
  const transactionSignerAccountIdColumnName =
    dataSource === DS_INDEXER_BACKEND ? "signer_account_id" : "signer_id";
  const transactionReceiverAccountIdColumnName =
    dataSource === DS_INDEXER_BACKEND ? "receiver_account_id" : "receiver_id";
  const transactionBlockHashColumnName =
    dataSource === DS_INDEXER_BACKEND ? "included_in_block_hash" : "block_hash";
  const blockHashColumnName =
    dataSource === DS_INDEXER_BACKEND ? "block_hash" : "hash";
  const blockHeightColumnName =
    dataSource === DS_INDEXER_BACKEND ? "block_height" : "height";
  const blockTimestampColumnName =
    dataSource === DS_INDEXER_BACKEND ? "block_timestamp" : "timestamp";
  const blockPrehashColumnName =
    dataSource === DS_INDEXER_BACKEND ? "prev_block_hash" : "prev_hash";

  let [transactions, blocks] = await Promise.all([
    queryRows(
      [
        `SELECT
            ${transactionHashColumnName} AS hash,
            ${transactionSignerAccountIdColumnName} AS signer_id,
            ${transactionReceiverAccountIdColumnName} AS receiver_id,
            ${transactionBlockHashColumnName} AS block_hash,
            block_timestamp,
            ${transactionIndexColumnName} AS transaction_index
          FROM transactions
          ORDER BY block_timestamp DESC, transaction_index DESC
          LIMIT 10`,
      ],
      { dataSource }
    ),
    queryRows(
      [
        `SELECT
            blocks.${blockHashColumnName} AS hash,
            blocks.${blockHeightColumnName} AS height,
            blocks.${blockTimestampColumnName} AS timestamp,
            blocks.${blockPrehashColumnName} AS prev_hash,
            COUNT(transactions.${transactionHashColumnName}) AS transactions_count
          FROM (
            SELECT blocks.${blockHashColumnName}
            FROM blocks
            ORDER BY blocks.${blockHeightColumnName} DESC
            LIMIT 8
          ) AS recent_blocks
          LEFT JOIN blocks ON blocks.${blockHashColumnName} = recent_blocks.${blockHashColumnName}
          LEFT JOIN transactions ON transactions.${transactionBlockHashColumnName} = recent_blocks.${blockHashColumnName}
          GROUP BY blocks.${blockHashColumnName}
          ORDER BY blocks.${blockTimestampColumnName} DESC`,
      ],
      { dataSource }
    ),
  ]);

  let query;
  let transactionHashes = transactions.map((transaction) => transaction.hash);
  if (dataSource === DS_INDEXER_BACKEND) {
    query = `SELECT transaction_hash, action_kind as kind, args
              FROM transaction_actions
              WHERE transaction_hash IN (:transactionHashes)
              ORDER BY index_in_transaction DESC`;
  } else {
    query = `SELECT transaction_hash, action_type as kind, action_args as args
              FROM actions
              WHERE transaction_hash IN (:transactionHashes)
              ORDER BY action_index DESC`;
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

  transactions.forEach((transaction) => {
    if (dataSource === DS_INDEXER_BACKEND) {
      transaction.block_timestamp = new BN(transaction.block_timestamp)
        .divn(10 ** 6)
        .toNumber();
    }
    const transactionActions = actionsByTransactionHash.get(transaction.hash);
    if (transactionActions) {
      transaction.actions = transactionActions.map((action) => {
        return {
          kind: action.kind,
          args:
            typeof action.args === "string"
              ? JSON.parse(action.args)
              : action.args,
        };
      });
    }
  });

  if (dataSource === DS_INDEXER_BACKEND) {
    blocks.forEach((block) => {
      block.timestamp = new BN(block.timestamp).divn(10 ** 6).toNumber();
    });
  }

  return { transactions, blocks };
};

const aggregateStats = async (options) => {
  async function queryLastDayTxCount({ dataSource }) {
    let query;
    if (dataSource === DS_INDEXER_BACKEND) {
      query = `SELECT COUNT(*) AS total FROM transactions
        WHERE block_timestamp > (cast(EXTRACT(EPOCH FROM NOW()) - 60 * 60 * 24 as bigint) * 1000 * 1000 * 1000)`;
    } else {
      query = `SELECT COUNT(*) AS total FROM transactions
        WHERE block_timestamp > (strftime('%s','now') - 60 * 60 * 24) * 1000`;
    }
    return await querySingleRow([query], { dataSource });
  }
  async function queryLatestBlockHeight({ dataSource }) {
    let query;
    if (dataSource === DS_INDEXER_BACKEND) {
      query = `SELECT block_height FROM blocks ORDER BY block_height DESC LIMIT 1`;
    } else {
      query = `SELECT height AS block_height FROM blocks ORDER BY height DESC LIMIT 1`;
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
    queryLatestBlockHeight(options),
  ]);
  return {
    totalAccounts: parseInt(totalAccounts.total),
    totalBlocks: parseInt(totalBlocks.total),
    totalTransactions: parseInt(totalTransactions.total),
    lastDayTxCount: parseInt(lastDayTxCount.total),
    lastBlockHeight: lastBlockHeight
      ? parseInt(lastBlockHeight.block_height)
      : 0,
  };
};

const queryTransactionsByDate = async () => {
  return await queryRows(
    [
      `SELECT
          TIMESTAMP 'epoch' + DIV(DIV(blocks.block_timestamp, 1000000000), 60 * 60 * 24) * INTERVAL '1 day' AS "date",
          COUNT(*) AS transactions_by_date
        FROM transactions
        JOIN blocks ON blocks.block_hash = transactions.included_in_block_hash
        GROUP BY "date"
        ORDER BY "date"`,
    ],
    { dataSource: DS_INDEXER_BACKEND }
  );
};

const queryTeragasUsedByDate = async () => {
  return await queryRows(
    [
      `SELECT
          TIMESTAMP 'epoch' + DIV(DIV(blocks.block_timestamp, 1000000000), 60 * 60 * 24) * INTERVAL '1 day' AS "date",
          DIV(SUM(chunks.gas_used), 1000000000000) AS teragas_used_by_date
        FROM blocks
        JOIN chunks ON chunks.included_in_block_hash = blocks.block_hash
        GROUP BY "date"
        ORDER BY "date"`,
    ],
    { dataSource: DS_INDEXER_BACKEND }
  );
};

const queryNewAccountsByDate = async () => {
  return await queryRows(
    [
      `SELECT
        TIMESTAMP 'epoch' + DIV(DIV(blocks.block_timestamp, 1000000000), 60 * 60 * 24) * INTERVAL '1 day' AS "date",
        COUNT(*) as new_accounts_by_date
      FROM accounts
      JOIN receipts ON receipts.receipt_id = accounts.created_by_receipt_id
      JOIN blocks ON blocks.block_hash = receipts.included_in_block_hash
      GROUP BY "date"
      ORDER BY "date"`,
    ],
    { dataSource: DS_INDEXER_BACKEND }
  );
};

const queryNewContractsByDate = async () => {
  return await queryRows(
    [
      `SELECT
        TIMESTAMP 'epoch' + DIV(DIV(receipts.included_in_block_timestamp, 1000000000), 60 * 60 * 24) * INTERVAL '1 day' AS "date",
        COUNT(distinct receipts.receiver_account_id) AS new_contracts_by_date
      FROM action_receipt_actions
      JOIN receipts ON receipts.receipt_id = action_receipt_actions.receipt_id 
      WHERE action_receipt_actions.action_kind = 'DEPLOY_CONTRACT'
      GROUP BY "date"
      ORDER BY "date"`,
    ],
    { dataSource: DS_INDEXER_BACKEND }
  );
};

exports.queryOnlineNodes = queryOnlineNodes;
exports.addNodeInfo = addNodeInfo;
exports.aggregateStats = aggregateStats;
exports.pickOnlineValidatingNode = pickOnlineValidatingNode;
exports.queryDashboardBlocksAndTxs = queryDashboardBlocksAndTxs;
exports.getSyncedGenesis = getSyncedGenesis;
exports.queryDashboardTxInfo = queryDashboardTxInfo;
exports.queryDashboardBlockInfo = queryDashboardBlockInfo;
exports.queryTransactionsByDate = queryTransactionsByDate;
exports.queryTeragasUsedByDate = queryTeragasUsedByDate;
exports.queryNewAccountsByDate = queryNewAccountsByDate;
exports.queryNewContractsByDate = queryNewContractsByDate;
