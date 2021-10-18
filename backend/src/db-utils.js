const {
  DS_INDEXER_BACKEND,
  DS_ANALYTICS_BACKEND,
  DS_TELEMETRY_BACKEND,
  PARTNER_LIST,
} = require("./consts");
const { nearStakingPoolAccountSuffix } = require("./config");
const models = require("../models");
const BN = require("bn.js");

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
      WHERE account_id IN (:accountArray)`,
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
        WHERE block_timestamp > (CAST(:latestBlockTimestamp - 60 AS bigint) * 1000 * 1000 * 1000)`,
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
      `SELECT DATE_TRUNC('day', TO_TIMESTAMP(DIV(block_timestamp, 1000*1000*1000))) AS date, COUNT(transaction_hash) AS total
      FROM transactions
      WHERE
        block_timestamp > (CAST(EXTRACT(EPOCH FROM DATE_TRUNC('day', NOW() - INTERVAL '15 day')) AS bigint) * 1000 * 1000 * 1000)
        AND
        block_timestamp < (CAST(EXTRACT(EPOCH FROM DATE_TRUNC('day', NOW())) AS bigint) * 1000 * 1000 * 1000)
      GROUP BY date
      ORDER BY date`,
    ],
    { dataSource: DS_INDEXER_BACKEND }
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
      `SELECT
       account_id,
       SUM(transactions_count) AS transactions_count
       FROM daily_transactions_per_account_count
       WHERE collected_for_day >= DATE_TRUNC('day', NOW() - INTERVAL '2 week')
       GROUP BY account_id
       ORDER BY transactions_count DESC
       LIMIT 10`,
    ],
    { dataSource: DS_ANALYTICS_BACKEND }
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

// stats
// transaction related
exports.queryTransactionsCountAggregatedByDate = queryTransactionsCountAggregatedByDate;
exports.queryGasUsedAggregatedByDate = queryGasUsedAggregatedByDate;
exports.queryDepositAmountAggregatedByDate = queryDepositAmountAggregatedByDate;

// accounts
exports.queryNewAccountsCountAggregatedByDate = queryNewAccountsCountAggregatedByDate;
exports.queryDeletedAccountsCountAggregatedByDate = queryDeletedAccountsCountAggregatedByDate;
exports.queryActiveAccountsCountAggregatedByDate = queryActiveAccountsCountAggregatedByDate;
exports.queryActiveAccountsList = queryActiveAccountsList;
exports.queryActiveAccountsCountAggregatedByWeek = queryActiveAccountsCountAggregatedByWeek;

// blocks
exports.queryFirstProducedBlockTimestamp = queryFirstProducedBlockTimestamp;

// contracts
exports.queryNewContractsCountAggregatedByDate = queryNewContractsCountAggregatedByDate;
exports.queryUniqueDeployedContractsCountAggregatedByDate = queryUniqueDeployedContractsCountAggregatedByDate;
exports.queryActiveContractsCountAggregatedByDate = queryActiveContractsCountAggregatedByDate;
exports.queryActiveContractsList = queryActiveContractsList;

// partner
exports.queryPartnerTotalTransactions = queryPartnerTotalTransactions;
exports.queryPartnerFirstThreeMonthTransactions = queryPartnerFirstThreeMonthTransactions;
exports.queryPartnerUniqueUserAmount = queryPartnerUniqueUserAmount;

// circulating supply
exports.queryLatestCirculatingSupply = queryLatestCirculatingSupply;
exports.queryCirculatingSupply = queryCirculatingSupply;

// calculate fee
exports.calculateFeesByDay = calculateFeesByDay;
