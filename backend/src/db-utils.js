const {
  DS_INDEXER_BACKEND,
  DS_ANALYTICS_BACKEND,
  DS_TELEMETRY_BACKEND,
  PARTNER_LIST,
} = require("./consts");
const { nearStakingPoolAccountSuffix } = require("./config");
const models = require("../models");
const BN = require("bn.js");

const ONE_DAY_TIMESTAMP_MILISEC = 24 * 60 * 60 * 1000;

const query = async ([query, replacements], { dataSource }) => {
  const sequelize = getSequelize(dataSource);
  return await sequelize.query(query, {
    replacements,
    type: models.Sequelize.QueryTypes.SELECT,
  });
};

function getSequelize(dataSource) {
  switch (dataSource) {
    case DS_INDEXER_BACKEND:
      return models.sequelizeIndexerBackendReadOnly;
    case DS_ANALYTICS_BACKEND:
      return models.sequelizeAnalyticsBackendReadOnly;
    case DS_TELEMETRY_BACKEND:
      return models.sequelizeTelemetryBackendReadOnly;
    default:
      throw Error("getSequelize() has no default dataSource");
  }
}

// we query block by id or hash in several places
// so can use this helper
const blockSearchCriteria = (blockId) =>
  typeof blockId === "string" ? "block_hash" : "block_height";

const querySingleRow = async (args, options) => {
  const result = await query(args, options || {});
  return result[0];
};

const queryRows = async (args, options) => {
  return await query(args, options || {});
};

const queryGenesisAccountCount = async () => {
  return await querySingleRow(
    [
      `SELECT
        COUNT(*)
      FROM accounts
      WHERE created_by_receipt_id IS NULL`,
    ],
    { dataSource: DS_INDEXER_BACKEND }
  );
};

// query for node information
const extendWithTelemetryInfo = async (nodes) => {
  const accountArray = nodes.map((node) => node.account_id);
  let nodesInfo = await queryRows(
    [
      `SELECT ip_address, account_id, node_id,
        last_seen, last_height, status,
        agent_name, agent_version, agent_build,
        latitude, longitude, city
      FROM nodes
      WHERE account_id IN (:accountArray)
      ORDER BY last_seen`,
      { accountArray },
    ],
    { dataSource: DS_TELEMETRY_BACKEND }
  );
  let nodeMap = new Map();
  if (nodesInfo && nodesInfo.length > 0) {
    for (let i = 0; i < nodesInfo.length; i++) {
      const { account_id: accountId, ...nodeInfo } = nodesInfo[i];
      nodeMap.set(accountId, {
        accountId,
        ipAddress: nodeInfo.ip_address,
        nodeId: nodeInfo.node_id,
        lastSeen: nodeInfo.last_seen,
        lastHeight: parseInt(nodeInfo.last_height),
        status: nodeInfo.status,
        agentName: nodeInfo.agent_name,
        agentVersion: nodeInfo.agent_version,
        agentBuild: nodeInfo.agent_build,
        latitude: nodeInfo.latitude,
        longitude: nodeInfo.longitude,
        city: nodeInfo.city,
      });
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

const queryNodeValidators = async () => {
  return await queryRows(
    [
      `SELECT
      account_id
    FROM accounts
    WHERE account_id LIKE '%${nearStakingPoolAccountSuffix}'`,
    ],
    { dataSource: DS_INDEXER_BACKEND }
  );
};

const queryOnlineNodes = async () => {
  const query = await queryRows(
    [
      `SELECT ip_address, account_id, node_id,
        last_seen, last_height, status,
        agent_name, agent_version, agent_build,
        latitude, longitude, city
      FROM nodes
      WHERE last_seen > NOW() - INTERVAL '60 seconds'
      ORDER BY is_validator ASC, node_id DESC`,
    ],
    { dataSource: DS_TELEMETRY_BACKEND }
  );

  return query.map((onlineNode) => ({
    accountId: onlineNode.account_id,
    ipAddress: onlineNode.ip_address,
    nodeId: onlineNode.node_id,
    lastSeen: onlineNode.last_seen,
    lastHeight: parseInt(onlineNode.last_height),
    status: onlineNode.status,
    agentName: onlineNode.agent_name,
    agentVersion: onlineNode.agent_version,
    agentBuild: onlineNode.agent_build,
    latitude: onlineNode.latitude,
    longitude: onlineNode.longitude,
    city: onlineNode.city,
  }));
};

// query for new dashboard
const queryDashboardBlocksStats = async (options) => {
  async function queryLatestBlockHeight({ dataSource }) {
    return (
      await querySingleRow(
        [`SELECT block_height FROM blocks ORDER BY block_height DESC LIMIT 1`],
        { dataSource }
      )
    ).block_height;
  }

  async function queryLatestGasPrice({ dataSource }) {
    return (
      await querySingleRow(
        [`SELECT gas_price FROM blocks ORDER BY block_height DESC LIMIT 1`],
        { dataSource }
      )
    ).gas_price;
  }

  async function queryRecentBlockProductionSpeed({ dataSource }) {
    const latestBlockTimestampOrNone = await querySingleRow(
      [
        `SELECT
          block_timestamp AS latest_block_timestamp
        FROM blocks ORDER BY block_timestamp DESC LIMIT 1`,
      ],
      { dataSource }
    );
    if (!latestBlockTimestampOrNone) {
      return 0;
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
      return 0;
    }

    const result = await querySingleRow(
      [
        `SELECT
          COUNT(*) AS blocks_count_60_seconds_before
        FROM blocks
        WHERE block_timestamp > (CAST(:latest_block_timestamp - 60 AS bigint) * 1000 * 1000 * 1000)`,
        {
          latest_block_timestamp:
            dataSource == DS_INDEXER_BACKEND
              ? latestBlockEpochTimeBN.toNumber()
              : latestBlockEpochTimeBN.muln(1000).toNumber(),
        },
      ],
      {
        dataSource,
      }
    );
    if (!result || !result.blocks_count_60_seconds_before) {
      return 0;
    }
    return result.blocks_count_60_seconds_before / 60;
  }

  const [
    latestBlockHeight,
    latestGasPrice,
    recentBlockProductionSpeed,
  ] = await Promise.all([
    queryLatestBlockHeight(options),
    queryLatestGasPrice(options),
    queryRecentBlockProductionSpeed(options),
  ]);
  return {
    latestBlockHeight,
    latestGasPrice,
    recentBlockProductionSpeed,
  };
};

const queryTransactionsCountHistoryForTwoWeeks = async () => {
  const query = await queryRows(
    [
      `SELECT collected_for_day AS date,
              transactions_count AS total
      FROM daily_transactions_count
      WHERE collected_for_day >= DATE_TRUNC('day', NOW() - INTERVAL '2 week')
      ORDER BY date`,
    ],
    { dataSource: DS_ANALYTICS_BACKEND }
  );

  return query.map(({ total, ...rest }) => ({
    total: parseInt(total),
    ...rest,
  }));
};

const queryRecentTransactionsCount = async () => {
  const { total } = await querySingleRow(
    [
      `SELECT
        COUNT(transaction_hash) AS total
      FROM transactions
      WHERE
        block_timestamp > (CAST(EXTRACT(EPOCH FROM NOW() - INTERVAL '1 day') AS bigint) * 1000 * 1000 * 1000)`,
    ],
    { dataSource: DS_INDEXER_BACKEND }
  );

  if (!total) {
    return undefined;
  }
  return parseInt(total);
};

// query for statistics and charts
// transactions related
const queryTransactionsCountAggregatedByDate = async () => {
  return await queryRows(
    [
      `SELECT collected_for_day  AS date,
              transactions_count AS transactions_count_by_date
       FROM daily_transactions_count
       ORDER BY date`,
    ],
    { dataSource: DS_ANALYTICS_BACKEND }
  );
};

const queryGasUsedAggregatedByDate = async () => {
  return await queryRows(
    [
      `SELECT collected_for_day AS date,
              gas_used          AS gas_used_by_date
       FROM daily_gas_used
       ORDER BY date`,
    ],
    { dataSource: DS_ANALYTICS_BACKEND }
  );
};

const queryDepositAmountAggregatedByDate = async () => {
  return await queryRows(
    [
      `SELECT collected_for_day AS date,
              deposit_amount    AS total_deposit_amount
       FROM daily_deposit_amount
       ORDER BY date`,
    ],
    { dataSource: DS_ANALYTICS_BACKEND }
  );
};

const queryTransactionsList = async (limit = 15, paginationIndexer) => {
  return await queryRows(
    [
      `SELECT
        transactions.transaction_hash as hash,
        transactions.signer_account_id as signer_id,
        transactions.receiver_account_id as receiver_id,
        transactions.included_in_block_hash as block_hash,
        DIV(transactions.block_timestamp, 1000*1000) as block_timestamp,
        transactions.index_in_chunk as transaction_index
       FROM transactions
       ${
         paginationIndexer
           ? `WHERE transactions.block_timestamp < :end_timestamp
       OR (transactions.block_timestamp = :end_timestamp
       AND transactions.index_in_chunk < :transaction_index)`
           : ""
       }
       ORDER BY transactions.block_timestamp DESC, transactions.index_in_chunk DESC
       LIMIT :limit`,
      {
        end_timestamp: paginationIndexer
          ? new BN(paginationIndexer.endTimestamp).muln(10 ** 6).toString()
          : undefined,
        transaction_index: paginationIndexer?.transactionIndex,
        limit,
      },
    ],
    { dataSource: DS_INDEXER_BACKEND }
  );
};

const queryAccountTransactionsList = async (
  accountId,
  limit = 15,
  paginationIndexer
) => {
  return await queryRows(
    [
      `SELECT transactions.transaction_hash AS hash,
              transactions.signer_account_id AS signer_id,
              transactions.receiver_account_id AS receiver_id,
              transactions.included_in_block_hash AS block_hash,
              DIV(transactions.block_timestamp, 1000 * 1000) AS block_timestamp,
              transactions.index_in_chunk AS transaction_index
      FROM transactions
      ${
        paginationIndexer
          ? `WHERE (transaction_hash IN
              (SELECT originated_from_transaction_hash
              FROM receipts
              WHERE receipts.predecessor_account_id = :account_id
                OR receipts.receiver_account_id = :account_id))
      AND (transactions.block_timestamp < :end_timestamp
            OR (transactions.block_timestamp = :end_timestamp
                AND transactions.index_in_chunk < :transaction_index))`
          : `WHERE transaction_hash IN
            (SELECT originated_from_transaction_hash
            FROM receipts
            WHERE receipts.predecessor_account_id = :account_id
              OR receipts.receiver_account_id = :account_id)`
      }
      ORDER BY transactions.block_timestamp DESC,
              transactions.index_in_chunk DESC
      LIMIT :limit`,
      {
        account_id: accountId,
        end_timestamp: paginationIndexer
          ? new BN(paginationIndexer.endTimestamp).muln(10 ** 6).toString()
          : undefined,
        transaction_index: paginationIndexer?.transactionIndex,
        limit,
      },
    ],
    { dataSource: DS_INDEXER_BACKEND }
  );
};

const queryTransactionsListInBlock = async (
  blockHash,
  limit = 15,
  paginationIndexer
) => {
  return await queryRows(
    [
      `SELECT
        transactions.transaction_hash as hash,
        transactions.signer_account_id as signer_id,
        transactions.receiver_account_id as receiver_id,
        transactions.included_in_block_hash as block_hash,
        DIV(transactions.block_timestamp, 1000*1000) as block_timestamp,
        transactions.index_in_chunk as transaction_index
       FROM transactions
       WHERE transactions.included_in_block_hash = :block_hash
       ${
         paginationIndexer
           ? `AND (transactions.block_timestamp < :end_timestamp
       OR (transactions.block_timestamp = :end_timestamp
       AND transactions.index_in_chunk < :transaction_index)`
           : ""
       }
       ORDER BY transactions.block_timestamp DESC, transactions.index_in_chunk DESC
       LIMIT :limit`,
      {
        block_hash: blockHash,
        end_timestamp: paginationIndexer
          ? new BN(paginationIndexer.endTimestamp).muln(10 ** 6).toString()
          : undefined,
        transaction_index: paginationIndexer?.transactionIndex,
        limit,
      },
    ],
    { dataSource: DS_INDEXER_BACKEND }
  );
};

const queryTransactionsActionsList = async (transactionHashes) => {
  return await queryRows(
    [
      `SELECT
        transaction_hash,
        action_kind AS kind,
        args
       FROM transaction_actions
       WHERE transaction_hash IN (:transaction_hashes)
       ORDER BY transaction_hash`,
      { transaction_hashes: transactionHashes },
    ],
    { dataSource: DS_INDEXER_BACKEND }
  );
};

const queryTransactionInfo = async (transactionHash) => {
  return await querySingleRow(
    [
      `SELECT
        transactions.transaction_hash as hash,
        transactions.signer_account_id as signer_id,
        transactions.receiver_account_id as receiver_id,
        transactions.included_in_block_hash as block_hash,
        DIV(transactions.block_timestamp, 1000*1000) as block_timestamp,
        transactions.index_in_chunk as transaction_index
       FROM transactions
       WHERE transactions.transaction_hash = :transaction_hash
       ORDER BY transactions.block_timestamp DESC, transactions.index_in_chunk DESC
       LIMIT 1`,
      { transaction_hash: transactionHash },
    ],
    { dataSource: DS_INDEXER_BACKEND }
  );
};

// accounts
const queryNewAccountsCountAggregatedByDate = async () => {
  return await queryRows(
    [
      `SELECT collected_for_day  AS date,
              new_accounts_count AS new_accounts_count_by_date
       FROM daily_new_accounts_count
       ORDER BY date`,
    ],
    { dataSource: DS_ANALYTICS_BACKEND }
  );
};

const queryDeletedAccountsCountAggregatedByDate = async () => {
  return await queryRows(
    [
      `SELECT collected_for_day      AS date,
              deleted_accounts_count AS deleted_accounts_count_by_date
       FROM daily_deleted_accounts_count
       ORDER BY date`,
    ],
    { dataSource: DS_ANALYTICS_BACKEND }
  );
};

const queryActiveAccountsCountAggregatedByDate = async () => {
  return await queryRows(
    [
      `SELECT collected_for_day     AS date,
              active_accounts_count AS active_accounts_count_by_date
       FROM daily_active_accounts_count
       ORDER BY date`,
    ],
    { dataSource: DS_ANALYTICS_BACKEND }
  );
};

const queryActiveAccountsCountAggregatedByWeek = async () => {
  return await queryRows(
    [
      `SELECT collected_for_week    AS date,
              active_accounts_count AS active_accounts_count_by_week
       FROM weekly_active_accounts_count
       ORDER BY date`,
    ],
    { dataSource: DS_ANALYTICS_BACKEND }
  );
};

const queryActiveAccountsList = async () => {
  return await queryRows(
    [
      `SELECT account_id,
              SUM(outgoing_transactions_count) AS transactions_count
       FROM daily_outgoing_transactions_per_account_count
       WHERE collected_for_day >= DATE_TRUNC('day', NOW() - INTERVAL '2 week')
       GROUP BY account_id
       ORDER BY transactions_count DESC
       LIMIT 10`,
    ],
    { dataSource: DS_ANALYTICS_BACKEND }
  );
};

const queryIndexedAccount = async (accountId) => {
  return await querySingleRow(
    [
      `SELECT account_id
       FROM accounts
       WHERE account_id = :account_id
       LIMIT 1`,
      { account_id: accountId },
    ],
    { dataSource: DS_INDEXER_BACKEND }
  );
};

const queryAccountsList = async (limit = 15, paginationIndexer) => {
  return await queryRows(
    [
      `SELECT account_id AS account_id,
              id AS account_index,
              DIV(receipts.included_in_block_timestamp, 1000*1000) AS created_at_block_timestamp
       FROM accounts
       LEFT JOIN receipts ON receipts.receipt_id = accounts.created_by_receipt_id
       ${paginationIndexer ? `WHERE id < :account_index` : ""}
       ORDER BY account_index DESC
       LIMIT :limit`,
      {
        limit,
        account_index: paginationIndexer?.accountIndex,
      },
    ],
    { dataSource: DS_INDEXER_BACKEND }
  );
};

const queryAccountOutcomeTransactionsCount = async (accountId) => {
  async function queryOutcomeTransactionsCountFromAnalytics(accountId) {
    const query = await querySingleRow(
      [
        `SELECT SUM(outgoing_transactions_count) AS out_transactions_count,
                MAX(collected_for_day) AS last_day_collected
         FROM daily_outgoing_transactions_per_account_count
         WHERE account_id = :account_id`,
        { account_id: accountId },
      ],
      { dataSource: DS_ANALYTICS_BACKEND }
    );
    const lastDayCollectedTimestamp = query?.last_day_collected
      ? new BN(new Date(query.last_day_collected).getTime())
          .add(new BN(ONE_DAY_TIMESTAMP_MILISEC))
          .muln(10 ** 6)
          .toString()
      : undefined;
    return {
      out_transactions_count: query?.out_transactions_count
        ? parseInt(query.out_transactions_count)
        : 0,
      last_day_collected_timestamp: lastDayCollectedTimestamp,
    };
  }
  async function queryOutcomeTransactionsCountFromIndexerForLastDay(
    accountId,
    lastDayCollectedTimestamp
  ) {
    // since analytics are collected for the previous day,
    // then 'lastDayCollectedTimestamp' may be 'null' for just created accounts so
    // we must put 'lastDayCollectedTimestamp' as below to dislay correct value
    const timestamp =
      lastDayCollectedTimestamp ||
      new BN(new Date().getTime())
        .sub(new BN(ONE_DAY_TIMESTAMP_MILISEC))
        .muln(10 ** 6)
        .toString();
    const query = await querySingleRow(
      [
        `SELECT
         COUNT(transactions.transaction_hash) AS out_transactions_count
         FROM transactions
         WHERE signer_account_id = :account_id
         AND transactions.block_timestamp >= :timestamp`,
        {
          account_id: accountId,
          timestamp,
        },
      ],
      { dataSource: DS_INDEXER_BACKEND }
    );
    if (!query || !query.out_transactions_count) {
      return 0;
    }
    return parseInt(query.out_transactions_count);
  }

  const {
    out_transactions_count: outTxCountFromAnalytics,
    last_day_collected_timestamp: lastDayCollectedTimestamp,
  } = await queryOutcomeTransactionsCountFromAnalytics(accountId);
  const outTxCountFromIndexer = await queryOutcomeTransactionsCountFromIndexerForLastDay(
    accountId,
    lastDayCollectedTimestamp
  );
  return outTxCountFromAnalytics + outTxCountFromIndexer;
};

const queryAccountIncomeTransactionsCount = async (accountId) => {
  async function queryIncomeTransactionsCountFromAnalytics(accountId) {
    const query = await querySingleRow(
      [
        `SELECT SUM(ingoing_transactions_count) as in_transactions_count,
                MAX(collected_for_day) AS last_day_collected
         FROM daily_ingoing_transactions_per_account_count
         WHERE account_id = :account_id`,
        { account_id: accountId },
      ],
      { dataSource: DS_ANALYTICS_BACKEND }
    );
    const lastDayCollectedTimestamp = query?.last_day_collected
      ? new BN(new Date(query.last_day_collected).getTime())
          .add(new BN(ONE_DAY_TIMESTAMP_MILISEC))
          .muln(10 ** 6)
          .toString()
      : undefined;
    return {
      in_transactions_count: query?.in_transactions_count
        ? parseInt(query.in_transactions_count)
        : 0,
      last_day_collected_timestamp: lastDayCollectedTimestamp,
    };
  }

  async function queryIncomeTransactionsCountFromIndexerForLastDay(
    accountId,
    lastDayCollectedTimestamp
  ) {
    // since analytics are collected for the previous day,
    // then 'lastDayCollectedTimestamp' may be 'null' for just created accounts so
    // we must put 'lastDayCollectedTimestamp' as below to dislay correct value
    const timestamp =
      lastDayCollectedTimestamp ||
      new BN(new Date().getTime())
        .sub(new BN(ONE_DAY_TIMESTAMP_MILISEC))
        .muln(10 ** 6)
        .toString();
    const query = await querySingleRow(
      [
        `SELECT COUNT(DISTINCT transactions.transaction_hash) AS in_transactions_count
         FROM transactions
         LEFT JOIN receipts ON receipts.originated_from_transaction_hash = transactions.transaction_hash
            AND transactions.block_timestamp >= :timestamp
         WHERE receipts.included_in_block_timestamp >= :timestamp
            AND transactions.signer_account_id != :requested_account_id
            AND receipts.receiver_account_id = :requested_account_id`,
        {
          requested_account_id: accountId,
          timestamp,
        },
      ],
      { dataSource: DS_INDEXER_BACKEND }
    );
    if (!query || !query.in_transactions_count) {
      return 0;
    }
    return parseInt(query.in_transactions_count);
  }

  const {
    in_transactions_count: inTxCountFromAnalytics,
    last_day_collected_timestamp: lastDayCollectedTimestamp,
  } = await queryIncomeTransactionsCountFromAnalytics(accountId);
  const inTxCountFromIndexer = await queryIncomeTransactionsCountFromIndexerForLastDay(
    accountId,
    lastDayCollectedTimestamp
  );
  return inTxCountFromAnalytics + inTxCountFromIndexer;
};

const queryAccountInfo = async (accountId) => {
  return await querySingleRow(
    [
      `SELECT
        inneraccounts.account_id,
        DIV(creation_receipt.included_in_block_timestamp, 1000*1000) AS created_at_block_timestamp,
        creation_receipt.originated_from_transaction_hash AS created_by_transaction_hash,
        DIV(deletion_receipt.included_in_block_timestamp, 1000*1000) AS deleted_at_block_timestamp,
        deletion_receipt.originated_from_transaction_hash AS deleted_by_transaction_hash
       FROM (
         SELECT account_id, created_by_receipt_id, deleted_by_receipt_id
             FROM accounts
             WHERE account_id = :account_id
       ) AS inneraccounts
       LEFT JOIN receipts AS creation_receipt ON creation_receipt.receipt_id = inneraccounts.created_by_receipt_id
       LEFT JOIN receipts AS deletion_receipt ON deletion_receipt.receipt_id = inneraccounts.deleted_by_receipt_id`,
      { account_id: accountId },
    ],
    { dataSource: DS_INDEXER_BACKEND }
  );
};

const queryAccountActivity = async (accountId, limit = 100) => {
  return await queryRows(
    [
      `SELECT TO_TIMESTAMP(DIV(account_changes.changed_in_block_timestamp, 1000 * 1000 * 1000))::date AS timestamp,
              account_changes.update_reason,
              account_changes.affected_account_nonstaked_balance AS nonstaked_balance,
              account_changes.affected_account_staked_balance AS staked_balance,
              account_changes.affected_account_storage_usage AS storage_usage,
              receipts.receipt_id,
              receipts.predecessor_account_id AS receipt_signer_id,
              receipts.receiver_account_id AS receipt_receiver_id,
              transactions.signer_account_id AS transaction_signer_id,
              transactions.receiver_account_id AS transaction_receiver_id,
              transaction_actions.action_kind AS transaction_transaction_kind,
              transaction_actions.args AS transaction_args,
              action_receipt_actions.action_kind AS receipt_kind,
              action_receipt_actions.args AS receipt_args
       FROM account_changes
       LEFT JOIN transactions ON transactions.transaction_hash = account_changes.caused_by_transaction_hash
       LEFT JOIN receipts ON receipts.receipt_id = account_changes.caused_by_receipt_id
       LEFT JOIN transaction_actions ON transaction_actions.transaction_hash = account_changes.caused_by_transaction_hash
       LEFT JOIN action_receipt_actions ON action_receipt_actions.receipt_id = receipts.receipt_id
       WHERE account_changes.affected_account_id = :account_id
       ORDER BY account_changes.changed_in_block_timestamp DESC
       LIMIT :limit`,
      {
        account_id: accountId,
        limit,
      },
    ],
    { dataSource: DS_INDEXER_BACKEND }
  );
};

// contracts
const queryNewContractsCountAggregatedByDate = async () => {
  return await queryRows(
    [
      `SELECT collected_for_day   AS date,
              new_contracts_count AS new_contracts_count_by_date
       FROM daily_new_contracts_count
       ORDER BY date`,
    ],
    { dataSource: DS_ANALYTICS_BACKEND }
  );
};

const queryUniqueDeployedContractsCountAggregatedByDate = async () => {
  return await queryRows(
    [
      `SELECT collected_for_day          AS date,
              new_unique_contracts_count AS contracts_count_by_date
       FROM daily_new_unique_contracts_count
       ORDER BY date`,
    ],
    { dataSource: DS_ANALYTICS_BACKEND }
  );
};

const queryActiveContractsCountAggregatedByDate = async () => {
  return await queryRows(
    [
      `SELECT collected_for_day      AS date,
              active_contracts_count AS active_contracts_count_by_date
       FROM daily_active_contracts_count
       ORDER BY date`,
    ],
    { dataSource: DS_ANALYTICS_BACKEND }
  );
};

const queryActiveContractsList = async () => {
  return await queryRows(
    [
      `SELECT contract_id,
              SUM(receipts_count) AS receipts_count
       FROM daily_receipts_per_contract_count
       WHERE collected_for_day >= DATE_TRUNC('day', NOW() - INTERVAL '2 week')
       GROUP BY contract_id
       ORDER BY receipts_count DESC
       LIMIT 10`,
    ],
    { dataSource: DS_ANALYTICS_BACKEND }
  );
};

// query for partners
const queryPartnerTotalTransactions = async () => {
  return await queryRows(
    [
      `SELECT
        receiver_account_id,
        COUNT(*) AS transactions_count
      FROM transactions
      WHERE receiver_account_id IN (:partner_list)
      GROUP BY receiver_account_id
      ORDER BY transactions_count DESC
      `,
      { partner_list: PARTNER_LIST },
    ],
    { dataSource: DS_INDEXER_BACKEND }
  );
};

const queryPartnerFirstThreeMonthTransactions = async () => {
  let partnerList = Array(PARTNER_LIST.length);
  for (let i = 0; i < PARTNER_LIST.length; i++) {
    let result = await querySingleRow(
      [
        `SELECT
          :partner AS receiver_account_id,
          COUNT(*) AS transactions_count
        FROM transactions
        WHERE receiver_account_id = :partner
        AND TO_TIMESTAMP(block_timestamp / 1000000000) < (
          SELECT
            (TO_TIMESTAMP(block_timestamp / 1000000000) + INTERVAL '3 month')
          FROM transactions
          WHERE receiver_account_id = :partner
          ORDER BY block_timestamp
          LIMIT 1)
      `,
        { partner: PARTNER_LIST[i] },
      ],
      { dataSource: DS_INDEXER_BACKEND }
    );
    partnerList[i] = result;
  }
  return partnerList;
};

const queryPartnerUniqueUserAmount = async () => {
  return await queryRows(
    [
      `SELECT
        receiver_account_id,
        COUNT(DISTINCT predecessor_account_id) AS user_amount
      FROM receipts
      WHERE receiver_account_id IN (:partner_list)
      GROUP BY receiver_account_id
      ORDER BY user_amount DESC`,
      { partner_list: PARTNER_LIST },
    ],
    { dataSource: DS_INDEXER_BACKEND }
  );
};

const queryLatestCirculatingSupply = async () => {
  return await querySingleRow(
    [
      `SELECT circulating_tokens_supply, computed_at_block_timestamp
       FROM aggregated__circulating_supply
       ORDER BY computed_at_block_timestamp DESC
       LIMIT 1;`,
    ],
    { dataSource: DS_INDEXER_BACKEND }
  );
};

// pass 'days' to set period of calculation
const calculateFeesByDay = async (days = 1) => {
  if (!(days >= 1 && days <= 7)) {
    throw Error(
      "calculateFeesByDay can only handle `days` values in range 1..7"
    );
  }
  return await querySingleRow(
    [
      `SELECT
        DATE_TRUNC('day', NOW() - INTERVAL '${days} day') AS date,
        SUM(execution_outcomes.tokens_burnt) AS fee
      FROM execution_outcomes
      WHERE
        executed_in_block_timestamp >= (CAST(EXTRACT(EPOCH FROM DATE_TRUNC('day', NOW() - INTERVAL '${days} day')) AS bigint) * 1000 * 1000 * 1000)
      AND
        executed_in_block_timestamp < (CAST(EXTRACT(EPOCH FROM DATE_TRUNC('day', NOW() - INTERVAL '${
          days - 1
        } day')) AS bigint) * 1000 * 1000 * 1000)`,
    ],
    { dataSource: DS_INDEXER_BACKEND }
  );
};

const queryCirculatingSupply = async () => {
  return await queryRows(
    [
      `SELECT
        DATE_TRUNC('day', TO_TIMESTAMP(DIV(computed_at_block_timestamp, 1000*1000*1000))) AS date,
        circulating_tokens_supply,
        total_tokens_supply
       FROM aggregated__circulating_supply
       ORDER BY date`,
    ],
    { dataSource: DS_INDEXER_BACKEND }
  );
};

const queryFirstProducedBlockTimestamp = async () => {
  return await querySingleRow(
    [
      `SELECT
        TO_TIMESTAMP(DIV(block_timestamp, 1000 * 1000 * 1000))::date AS first_produced_block_timestamp
       FROM blocks
       ORDER BY blocks.block_timestamp
       LIMIT 1`,
    ],
    { dataSource: DS_INDEXER_BACKEND }
  );
};

// blocks
const queryBlocksList = async (limit = 15, paginationIndexer) => {
  return await queryRows(
    [
      `SELECT
        blocks.block_hash AS hash,
        blocks.block_height AS height,
        DIV(blocks.block_timestamp, 1000*1000) AS timestamp,
        blocks.prev_block_hash AS prev_hash,
        COUNT(transactions.transaction_hash) AS transactions_count
      FROM (
        SELECT blocks.block_hash AS block_hash
        FROM blocks
        ${
          paginationIndexer
            ? `WHERE blocks.block_timestamp < :pagination_indexer`
            : ""
        }
        ORDER BY blocks.block_height DESC
        LIMIT :limit
      ) AS innerblocks
      LEFT JOIN transactions ON transactions.included_in_block_hash = innerblocks.block_hash
      LEFT JOIN blocks ON blocks.block_hash = innerblocks.block_hash
      GROUP BY blocks.block_hash
      ORDER BY blocks.block_timestamp DESC`,
      {
        limit,
        pagination_indexer: paginationIndexer
          ? new BN(paginationIndexer).muln(10 ** 6).toString()
          : undefined,
      },
    ],
    { dataSource: DS_INDEXER_BACKEND }
  );
};

const queryBlockInfo = async (blockId) => {
  const searchCriteria = blockSearchCriteria(blockId);
  return await querySingleRow(
    [
      `SELECT
        blocks.block_hash AS hash,
        blocks.block_height AS height,
        DIV(blocks.block_timestamp, 1000*1000) AS timestamp,
        blocks.prev_block_hash AS prev_hash,
        blocks.gas_price AS gas_price,
        blocks.total_supply AS total_supply,
        blocks.author_account_id AS author_account_id,
        COUNT(transactions.transaction_hash) AS transactions_count
      FROM (
        SELECT blocks.block_hash AS block_hash
        FROM blocks
        WHERE blocks.${searchCriteria} = :block_id
      ) AS innerblocks
      LEFT JOIN transactions ON transactions.included_in_block_hash = innerblocks.block_hash
      LEFT JOIN blocks ON blocks.block_hash = innerblocks.block_hash
      GROUP BY blocks.block_hash
      ORDER BY blocks.block_timestamp DESC
      LIMIT 1`,
      { block_id: blockId },
    ],
    { dataSource: DS_INDEXER_BACKEND }
  );
};

const queryBlockByHashOrId = async (blockId) => {
  const searchCriteria = blockSearchCriteria(blockId);
  return await querySingleRow(
    [
      `SELECT block_hash
       FROM blocks
       WHERE ${searchCriteria} = :block_id
       LIMIT 1`,
      { block_id: blockId },
    ],
    { dataSource: DS_INDEXER_BACKEND }
  );
};

// receipts
const queryReceiptsCountInBlock = async (blockHash) => {
  return await querySingleRow(
    [
      `SELECT
        COUNT(receipt_id)
       FROM receipts
       WHERE receipts.included_in_block_hash = :block_hash
       AND receipts.receipt_kind = 'ACTION'`,
      { block_hash: blockHash },
    ],
    { dataSource: DS_INDEXER_BACKEND }
  );
};

const queryReceiptInTransaction = async (receiptId) => {
  return await querySingleRow(
    [
      `SELECT
        receipt_id, originated_from_transaction_hash
       FROM receipts
       WHERE receipt_id = :receipt_id
       LIMIT 1`,
      { receipt_id: receiptId },
    ],
    { dataSource: DS_INDEXER_BACKEND }
  );
};

const queryIndexedTransaction = async (transactionHash) => {
  return await querySingleRow(
    [
      `SELECT transaction_hash
       FROM transactions
       WHERE transaction_hash = :transaction_hash
       LIMIT 1`,
      { transaction_hash: transactionHash },
    ],
    { dataSource: DS_INDEXER_BACKEND }
  );
};

// expose receipts included in blockHash
const queryReceiptsList = async (blockHash) => {
  return await queryRows(
    [
      `SELECT
        receipts.receipt_id,
        receipts.originated_from_transaction_hash,
        receipts.predecessor_account_id AS predecessor_id,
        receipts.receiver_account_id AS receiver_id,
        execution_outcomes.status,
        execution_outcomes.gas_burnt,
        execution_outcomes.tokens_burnt,
        execution_outcomes.executed_in_block_timestamp,
        action_receipt_actions.action_kind AS kind,
        action_receipt_actions.args
       FROM action_receipt_actions
       LEFT JOIN receipts ON receipts.receipt_id = action_receipt_actions.receipt_id
       LEFT JOIN execution_outcomes ON execution_outcomes.receipt_id = action_receipt_actions.receipt_id
       WHERE receipts.included_in_block_hash = :block_hash
       AND receipts.receipt_kind = 'ACTION'
       ORDER BY receipts.included_in_chunk_hash, receipts.index_in_chunk, action_receipt_actions.index_in_action_receipt`,
      { block_hash: blockHash },
    ],
    { dataSource: DS_INDEXER_BACKEND }
  );
};
// query receipts executed in particular block
const queryExecutedReceiptsList = async (blockHash) => {
  return await queryRows(
    [
      `SELECT
        receipts.receipt_id,
        receipts.originated_from_transaction_hash,
        receipts.predecessor_account_id AS predecessor_id,
        receipts.receiver_account_id AS receiver_id,
        execution_outcomes.status,
        execution_outcomes.gas_burnt,
        execution_outcomes.tokens_burnt,
        execution_outcomes.executed_in_block_timestamp,
        action_receipt_actions.action_kind AS kind,
        action_receipt_actions.args
       FROM action_receipt_actions
       LEFT JOIN receipts ON receipts.receipt_id = action_receipt_actions.receipt_id
       LEFT JOIN execution_outcomes ON execution_outcomes.receipt_id = action_receipt_actions.receipt_id
       WHERE execution_outcomes.executed_in_block_hash = :block_hash
       AND receipts.receipt_kind = 'ACTION'
       ORDER BY receipts.included_in_chunk_hash, receipts.index_in_chunk, action_receipt_actions.index_in_action_receipt`,
      { block_hash: blockHash },
    ],
    { dataSource: DS_INDEXER_BACKEND }
  );
};

const queryContractInfo = async (accountId) => {
  // find the latest update in analytics db
  const {
    latest_updated_timestamp: latestUpdatedTimestamp,
  } = await querySingleRow(
    [
      `SELECT deployed_at_block_timestamp AS latest_updated_timestamp
       FROM deployed_contracts
       ORDER BY deployed_at_block_timestamp DESC
       LIMIT 1`,
    ],
    { dataSource: DS_ANALYTICS_BACKEND }
  );
  // query for the latest info from indexer
  // if it return 'undefined' then there was no update since deployed_at_block_timestamp
  const contractInfoFromIndexer = await querySingleRow(
    [
      `SELECT
       DIV(receipts.included_in_block_timestamp, 1000*1000) AS block_timestamp,
       receipts.originated_from_transaction_hash AS hash
       FROM action_receipt_actions
       LEFT JOIN receipts ON receipts.receipt_id = action_receipt_actions.receipt_id
       WHERE action_receipt_actions.action_kind = 'DEPLOY_CONTRACT'
       AND action_receipt_actions.receipt_receiver_account_id = :account_id
       AND action_receipt_actions.receipt_included_in_block_timestamp > :timestamp
       ORDER BY action_receipt_actions.receipt_included_in_block_timestamp DESC
       LIMIT 1`,
      {
        account_id: accountId,
        timestamp: latestUpdatedTimestamp,
      },
    ],
    { dataSource: DS_INDEXER_BACKEND }
  );

  if (contractInfoFromIndexer) {
    return {
      block_timestamp: contractInfoFromIndexer.block_timestamp,
      hash: contractInfoFromIndexer.hash,
    };
  }

  // query to analytics db to find latest historical record
  const contractInfoFromAnalytics = await querySingleRow(
    [
      `SELECT
       deployed_by_receipt_id AS receipt_id,
       DIV(deployed_at_block_timestamp, 1000*1000) AS block_timestamp
       FROM deployed_contracts
       WHERE deployed_to_account_id = :account_id
       ORDER BY deployed_at_block_timestamp DESC
       LIMIT 1`,
      { account_id: accountId },
    ],
    { dataSource: DS_ANALYTICS_BACKEND }
  );

  // query for transaction hash where contact was deployed
  const { hash } = await querySingleRow(
    [
      `SELECT originated_from_transaction_hash AS hash
        FROM receipts
        WHERE receipt_id = :receipt_id
        LIMIT 1`,
      { receipt_id: contractInfoFromAnalytics.receipt_id },
    ],
    { dataSource: DS_INDEXER_BACKEND }
  );

  if (contractInfoFromAnalytics) {
    return {
      block_timestamp: contractInfoFromAnalytics.block_timestamp,
      hash,
    };
  }
  return undefined;
};

// chunks
const queryGasUsedInChunks = async (blockHash) => {
  return await querySingleRow(
    [
      `SELECT SUM(gas_used) AS gas_used
       FROM chunks
       WHERE included_in_block_hash = :block_hash`,
      { block_hash: blockHash },
    ],
    { dataSource: DS_INDEXER_BACKEND }
  );
};

// node part
exports.queryOnlineNodes = queryOnlineNodes;
exports.extendWithTelemetryInfo = extendWithTelemetryInfo;
exports.pickOnlineValidatingNode = pickOnlineValidatingNode;
exports.queryNodeValidators = queryNodeValidators;

// genesis
exports.queryGenesisAccountCount = queryGenesisAccountCount;

// dashboard
exports.queryTransactionsCountHistoryForTwoWeeks = queryTransactionsCountHistoryForTwoWeeks;
exports.queryRecentTransactionsCount = queryRecentTransactionsCount;
exports.queryDashboardBlocksStats = queryDashboardBlocksStats;

// transaction related
exports.queryTransactionsCountAggregatedByDate = queryTransactionsCountAggregatedByDate;
exports.queryGasUsedAggregatedByDate = queryGasUsedAggregatedByDate;
exports.queryDepositAmountAggregatedByDate = queryDepositAmountAggregatedByDate;
exports.queryIndexedTransaction = queryIndexedTransaction;
exports.queryTransactionsList = queryTransactionsList;
exports.queryTransactionsActionsList = queryTransactionsActionsList;
exports.queryAccountTransactionsList = queryAccountTransactionsList;
exports.queryTransactionsListInBlock = queryTransactionsListInBlock;
exports.queryTransactionInfo = queryTransactionInfo;

// accounts
exports.queryNewAccountsCountAggregatedByDate = queryNewAccountsCountAggregatedByDate;
exports.queryDeletedAccountsCountAggregatedByDate = queryDeletedAccountsCountAggregatedByDate;
exports.queryActiveAccountsCountAggregatedByDate = queryActiveAccountsCountAggregatedByDate;
exports.queryActiveAccountsList = queryActiveAccountsList;
exports.queryActiveAccountsCountAggregatedByWeek = queryActiveAccountsCountAggregatedByWeek;
exports.queryIndexedAccount = queryIndexedAccount;
exports.queryAccountsList = queryAccountsList;
exports.queryAccountInfo = queryAccountInfo;
exports.queryAccountOutcomeTransactionsCount = queryAccountOutcomeTransactionsCount;
exports.queryAccountIncomeTransactionsCount = queryAccountIncomeTransactionsCount;
exports.queryAccountActivity = queryAccountActivity;

// blocks
exports.queryFirstProducedBlockTimestamp = queryFirstProducedBlockTimestamp;
exports.queryBlocksList = queryBlocksList;
exports.queryBlockInfo = queryBlockInfo;
exports.queryBlockByHashOrId = queryBlockByHashOrId;

// contracts
exports.queryNewContractsCountAggregatedByDate = queryNewContractsCountAggregatedByDate;
exports.queryUniqueDeployedContractsCountAggregatedByDate = queryUniqueDeployedContractsCountAggregatedByDate;
exports.queryActiveContractsCountAggregatedByDate = queryActiveContractsCountAggregatedByDate;
exports.queryActiveContractsList = queryActiveContractsList;
exports.queryContractInfo = queryContractInfo;

// partner
exports.queryPartnerTotalTransactions = queryPartnerTotalTransactions;
exports.queryPartnerFirstThreeMonthTransactions = queryPartnerFirstThreeMonthTransactions;
exports.queryPartnerUniqueUserAmount = queryPartnerUniqueUserAmount;

// circulating supply
exports.queryLatestCirculatingSupply = queryLatestCirculatingSupply;
exports.queryCirculatingSupply = queryCirculatingSupply;

// calculate fee
exports.calculateFeesByDay = calculateFeesByDay;

// receipts
exports.queryReceiptsCountInBlock = queryReceiptsCountInBlock;
exports.queryReceiptInTransaction = queryReceiptInTransaction;
exports.queryReceiptsList = queryReceiptsList;

// chunks
exports.queryGasUsedInChunks = queryGasUsedInChunks;
