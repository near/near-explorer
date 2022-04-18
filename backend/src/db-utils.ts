import { Pool } from "pg";
import BN from "bn.js";
import { PARTNER_LIST, DataSource } from "./consts";
import { nearStakingPoolAccountSuffix } from "./config";
import { databases, withPool } from "./db";
import { AccountPagination, TransactionPagination } from "./client-types";
import { StakingNode } from "./near";
import { trimError } from "./utils";

const ONE_DAY_TIMESTAMP_MILISEC = 24 * 60 * 60 * 1000;

type Replacements = Record<string, unknown> | undefined;

type QueryArgs<Args extends Replacements> = Args extends undefined
  ? [string]
  : [string, Args];
type QueryOptions = { dataSource: DataSource };

type QueryReducerArray = [string, unknown[], number];
const convertParamSqlToPlainSql = <Args extends Replacements>(
  parameterizedSql: string,
  params?: Args
): [string, unknown[]?] => {
  if (!params) {
    return [parameterizedSql];
  }
  const [text, values] = Object.entries(params).reduce<QueryReducerArray>(
    ([sql, array, index], [key, value]) =>
      value === undefined
        ? [sql, array, index]
        : [
            sql.replace(new RegExp(`:${key}`, "g"), `$${index}`),
            [...array, value],
            index + 1,
          ],
    [parameterizedSql, [], 1]
  );
  return [text, values];
};

const query = async <T extends object, Args extends Replacements>(
  [query, replacements]: QueryArgs<Args>,
  { dataSource }: QueryOptions
): Promise<T[]> => {
  const [sql, values] = convertParamSqlToPlainSql(query, replacements);
  try {
    return await withPool(getPool(dataSource), async (client) => {
      const result = await client.query<T>(sql, values);
      return result.rows;
    });
  } catch (e) {
    const errorLines = [
      `SQL query failed with error: ${trimError(e)}`,
      `SQL: ${sql}`,
      values
        ? `Extrapolated values: ${values.map(
            (value, index) => `$${index + 1} -> ${value}`
          )}`
        : "",
    ]
      .filter(Boolean)
      .join("\n\n");
    console.error(errorLines);
    throw e;
  }
};

function getPool(dataSource: DataSource): Pool {
  switch (dataSource) {
    case DataSource.Indexer:
      return databases.indexerBackendReadOnlyPool;
    case DataSource.Analytics:
      return databases.analyticsBackendReadOnlyPool;
    case DataSource.Telemetry:
      return databases.telemetryBackendReadOnlyPool;
  }
}

// we query block by id or hash in several places
// so can use this helper
const blockSearchCriteria = (blockId: string | number): string =>
  typeof blockId === "string" ? "block_hash" : "block_height";

const querySingleRow = async <
  T extends object,
  Args extends Replacements = undefined
>(
  args: QueryArgs<Args>,
  options: QueryOptions
): Promise<T | undefined> => {
  const result = await query<T, Args>(args, options);
  return result[0];
};

const queryRows = async <
  T extends object,
  Args extends Replacements = undefined
>(
  args: QueryArgs<Args>,
  options: QueryOptions
): Promise<T[]> => {
  return await query<T, Args>(args, options);
};

const queryGenesisAccountCount = async (): Promise<{ count: string }> => {
  const result = await querySingleRow<{ count: string }>(
    [
      `SELECT
        COUNT(*)
      FROM accounts
      WHERE created_by_receipt_id IS NULL`,
    ],
    { dataSource: DataSource.Indexer }
  );
  return result!;
};

// model of "blocks" table in indexer DB
type BlockModel = {
  block_height: string;
  block_hash: string;
  prev_block_hash: string;
  block_timestamp: string;
  total_supply: string;
  gas_price: string;
  author_account_id: string;
};

// model of "nodes" table in telemetry DB
type NodeModel = {
  ip_address: string;
  moniker: string;
  account_id: string;
  node_id: string;
  last_seen: Date;
  last_height: string;
  agent_name: string;
  agent_version: string;
  agent_build: string;
  peer_count: string;
  is_validator: boolean;
  last_hash: string;
  signature: string;
  status: string;
  latitude: string | null;
  longitude: string | null;
  city: string | null;
};

type GenericNodeModelProps =
  | "ip_address"
  | "account_id"
  | "node_id"
  | "last_seen"
  | "last_height"
  | "agent_name"
  | "agent_version"
  | "agent_build"
  | "status"
  | "latitude"
  | "longitude"
  | "city";

export type OnlineNode = {
  accountId: string;
  ipAddress: string;
  nodeId: string;
  lastSeen: number;
  lastHeight: number;
  status: string;
  agentName: string;
  agentVersion: string;
  agentBuild: string;
  latitude: string | null;
  longitude: string | null;
  city: string | null;
};

export type StakingNodeWithTelemetryInfo = StakingNode & {
  nodeInfo?: OnlineNode;
};

// query for node information
const extendWithTelemetryInfo = async (
  nodes: StakingNode[]
): Promise<StakingNodeWithTelemetryInfo[]> => {
  const accountArray = nodes.map((node) => node.account_id);
  let nodesInfo = await queryRows<
    Pick<NodeModel, GenericNodeModelProps>,
    { accountArray: string[] }
  >(
    [
      `SELECT ip_address, account_id, node_id,
        last_seen, last_height, status,
        agent_name, agent_version, agent_build,
        latitude, longitude, city
      FROM nodes
      WHERE account_id = ANY (:accountArray)
      ORDER BY last_seen`,
      { accountArray },
    ],
    { dataSource: DataSource.Telemetry }
  );
  let nodeMap = new Map<string, OnlineNode>();
  if (nodesInfo && nodesInfo.length > 0) {
    for (let i = 0; i < nodesInfo.length; i++) {
      const { account_id: accountId, ...nodeInfo } = nodesInfo[i];
      nodeMap.set(accountId, {
        accountId,
        ipAddress: nodeInfo.ip_address,
        nodeId: nodeInfo.node_id,
        lastSeen: nodeInfo.last_seen.valueOf(),
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

  return nodes.map((node) => ({
    ...node,
    nodeInfo: nodeMap.get(node.account_id),
  }));
};

const queryNodeValidators = async (): Promise<{ account_id: string }[]> => {
  return await queryRows<{ account_id: string }>(
    [
      `SELECT
      account_id
    FROM accounts
    WHERE account_id LIKE '%${nearStakingPoolAccountSuffix}'`,
    ],
    { dataSource: DataSource.Indexer }
  );
};

const queryOnlineNodes = async (): Promise<OnlineNode[]> => {
  const query = await queryRows<Pick<NodeModel, GenericNodeModelProps>>(
    [
      `SELECT ip_address, account_id, node_id,
        last_seen, last_height, status,
        agent_name, agent_version, agent_build,
        latitude, longitude, city
      FROM nodes
      WHERE last_seen > NOW() - INTERVAL '60 seconds'
      ORDER BY is_validator ASC, node_id DESC`,
    ],
    { dataSource: DataSource.Telemetry }
  );

  return query.map((onlineNode) => ({
    accountId: onlineNode.account_id,
    ipAddress: onlineNode.ip_address,
    nodeId: onlineNode.node_id,
    lastSeen: onlineNode.last_seen.valueOf(),
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
const queryDashboardBlocksStats = async () => {
  async function queryLatestBlockHeight(): Promise<string> {
    const latestBlockHeightResult = await querySingleRow<
      Pick<BlockModel, "block_height">
    >([`SELECT block_height FROM blocks ORDER BY block_height DESC LIMIT 1`], {
      dataSource: DataSource.Indexer,
    });
    if (!latestBlockHeightResult) {
      throw new Error("No latest block height found");
    }
    return latestBlockHeightResult.block_height;
  }

  async function queryLatestGasPrice(): Promise<string> {
    const latestGasPriceResult = await querySingleRow<
      Pick<BlockModel, "gas_price">
    >([`SELECT gas_price FROM blocks ORDER BY block_height DESC LIMIT 1`], {
      dataSource: DataSource.Indexer,
    });
    if (!latestGasPriceResult) {
      throw new Error("No latest gas price found");
    }
    return latestGasPriceResult.gas_price;
  }

  async function queryRecentBlockProductionSpeed() {
    const latestBlockTimestampOrNone = await querySingleRow<
      Pick<BlockModel, "block_timestamp">
    >(
      [
        `SELECT
          block_timestamp
        FROM blocks ORDER BY block_timestamp DESC LIMIT 1`,
      ],
      { dataSource: DataSource.Indexer }
    );
    if (!latestBlockTimestampOrNone) {
      return 0;
    }
    const {
      block_timestamp: latestBlockTimestamp,
    } = latestBlockTimestampOrNone;
    const latestBlockTimestampBN = new BN(latestBlockTimestamp);
    const currentUnixTimeBN = new BN(Math.floor(new Date().getTime() / 1000));
    const latestBlockEpochTimeBN = latestBlockTimestampBN.div(
      new BN("1000000000")
    );
    // If the latest block is older than 1 minute from now, we report 0
    if (currentUnixTimeBN.sub(latestBlockEpochTimeBN).gtn(60)) {
      return 0;
    }

    const result = await querySingleRow<
      {
        blocks_count_60_seconds_before: string;
      },
      {
        latest_block_timestamp: number;
      }
    >(
      [
        `SELECT
          COUNT(*) AS blocks_count_60_seconds_before
        FROM blocks
        WHERE block_timestamp > (CAST(:latest_block_timestamp - 60 AS bigint) * 1000 * 1000 * 1000)`,
        {
          latest_block_timestamp: latestBlockEpochTimeBN.toNumber(),
        },
      ],
      {
        dataSource: DataSource.Indexer,
      }
    );
    return parseInt(result!.blocks_count_60_seconds_before) / 60;
  }

  const [
    latestBlockHeight,
    latestGasPrice,
    recentBlockProductionSpeed,
  ] = await Promise.all([
    queryLatestBlockHeight(),
    queryLatestGasPrice(),
    queryRecentBlockProductionSpeed(),
  ]);
  return {
    latestBlockHeight,
    latestGasPrice,
    recentBlockProductionSpeed,
  };
};

const queryTransactionsCountHistoryForTwoWeeks = async (): Promise<
  { date: Date; total: number }[]
> => {
  const query = await queryRows<{ date: Date; total: string }>(
    [
      `SELECT collected_for_day AS date,
              transactions_count AS total
      FROM daily_transactions_count
      WHERE collected_for_day >= DATE_TRUNC('day', NOW() - INTERVAL '2 week')
      ORDER BY date`,
    ],
    { dataSource: DataSource.Analytics }
  );

  return query.map(({ total, ...rest }) => ({
    total: parseInt(total),
    ...rest,
  }));
};

const queryRecentTransactionsCount = async (): Promise<number | undefined> => {
  const result = await querySingleRow<{ total: string }>(
    [
      `SELECT
        COUNT(transaction_hash) AS total
      FROM transactions
      WHERE
        block_timestamp > (CAST(EXTRACT(EPOCH FROM NOW() - INTERVAL '1 day') AS bigint) * 1000 * 1000 * 1000)`,
    ],
    { dataSource: DataSource.Indexer }
  );

  return parseInt(result!.total);
};

// query for statistics and charts
// transactions related
const queryTransactionsCountAggregatedByDate = async (): Promise<
  { date: Date; transactions_count_by_date: string }[]
> => {
  return await queryRows<{ date: Date; transactions_count_by_date: string }>(
    [
      `SELECT collected_for_day  AS date,
              transactions_count AS transactions_count_by_date
       FROM daily_transactions_count
       ORDER BY date`,
    ],
    { dataSource: DataSource.Analytics }
  );
};

const queryGasUsedAggregatedByDate = async (): Promise<
  { date: Date; gas_used_by_date: string }[]
> => {
  return await queryRows<{ date: Date; gas_used_by_date: string }>(
    [
      `SELECT collected_for_day AS date,
              gas_used          AS gas_used_by_date
       FROM daily_gas_used
       ORDER BY date`,
    ],
    { dataSource: DataSource.Analytics }
  );
};

const queryDepositAmountAggregatedByDate = async (): Promise<
  { date: Date; total_deposit_amount: string }[]
> => {
  return await queryRows<{ date: Date; total_deposit_amount: string }>(
    [
      `SELECT collected_for_day AS date,
              deposit_amount    AS total_deposit_amount
       FROM daily_deposit_amount
       ORDER BY date`,
    ],
    { dataSource: DataSource.Analytics }
  );
};

export type QueryTransaction = {
  hash: string;
  signer_id: string;
  receiver_id: string;
  block_hash: string;
  block_timestamp: string;
  transaction_index: number;
};

const queryTransactionsList = async (
  limit: number = 15,
  paginationIndexer?: TransactionPagination
): Promise<QueryTransaction[]> => {
  return await queryRows<
    QueryTransaction,
    {
      end_timestamp?: string;
      transaction_index?: number;
      limit: number;
    }
  >(
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
    { dataSource: DataSource.Indexer }
  );
};

const queryAccountTransactionsList = async (
  accountId: string,
  limit: number = 15,
  paginationIndexer?: TransactionPagination
): Promise<QueryTransaction[]> => {
  return await queryRows<
    QueryTransaction,
    {
      account_id?: string;
      end_timestamp?: string;
      transaction_index?: number;
      limit: number;
    }
  >(
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
    { dataSource: DataSource.Indexer }
  );
};

const queryTransactionsListInBlock = async (
  blockHash: string,
  limit: number = 15,
  paginationIndexer?: TransactionPagination
): Promise<QueryTransaction[]> => {
  return await queryRows<
    QueryTransaction,
    {
      block_hash?: string;
      end_timestamp?: string;
      transaction_index?: number;
      limit: number;
    }
  >(
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
    { dataSource: DataSource.Indexer }
  );
};

const queryTransactionsActionsList = async (
  transactionHashes: string[]
): Promise<
  {
    transaction_hash: string;
    kind: string;
    args: Record<string, unknown>;
  }[]
> => {
  return await queryRows<
    {
      transaction_hash: string;
      kind: string;
      args: Record<string, unknown>;
    },
    {
      transaction_hashes: string[];
    }
  >(
    [
      `SELECT
        transaction_hash,
        action_kind AS kind,
        args
       FROM transaction_actions
       WHERE transaction_hash = ANY (:transaction_hashes)
       ORDER BY transaction_hash`,
      { transaction_hashes: transactionHashes },
    ],
    { dataSource: DataSource.Indexer }
  );
};

const queryTransactionInfo = async (
  transactionHash: string
): Promise<QueryTransaction | undefined> => {
  return await querySingleRow<QueryTransaction, { transaction_hash: string }>(
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
    { dataSource: DataSource.Indexer }
  );
};

// accounts
const queryNewAccountsCountAggregatedByDate = async (): Promise<
  { date: Date; new_accounts_count_by_date: number }[]
> => {
  return await queryRows<{ date: Date; new_accounts_count_by_date: number }>(
    [
      `SELECT collected_for_day  AS date,
              new_accounts_count AS new_accounts_count_by_date
       FROM daily_new_accounts_count
       ORDER BY date`,
    ],
    { dataSource: DataSource.Analytics }
  );
};

const queryDeletedAccountsCountAggregatedByDate = async (): Promise<
  {
    date: Date;
    deleted_accounts_count_by_date: number;
  }[]
> => {
  return await queryRows<{
    date: Date;
    deleted_accounts_count_by_date: number;
  }>(
    [
      `SELECT collected_for_day      AS date,
              deleted_accounts_count AS deleted_accounts_count_by_date
       FROM daily_deleted_accounts_count
       ORDER BY date`,
    ],
    { dataSource: DataSource.Analytics }
  );
};

const queryActiveAccountsCountAggregatedByDate = async (): Promise<
  {
    date: Date;
    active_accounts_count_by_date: number;
  }[]
> => {
  return await queryRows<{
    date: Date;
    active_accounts_count_by_date: number;
  }>(
    [
      `SELECT collected_for_day     AS date,
              active_accounts_count AS active_accounts_count_by_date
       FROM daily_active_accounts_count
       ORDER BY date`,
    ],
    { dataSource: DataSource.Analytics }
  );
};

const queryActiveAccountsCountAggregatedByWeek = async (): Promise<
  {
    date: Date;
    active_accounts_count_by_week: number;
  }[]
> => {
  return await queryRows<{
    date: Date;
    active_accounts_count_by_week: number;
  }>(
    [
      `SELECT collected_for_week    AS date,
              active_accounts_count AS active_accounts_count_by_week
       FROM weekly_active_accounts_count
       ORDER BY date`,
    ],
    { dataSource: DataSource.Analytics }
  );
};

const queryActiveAccountsList = async (): Promise<
  { account_id: string; transactions_count: string }[]
> => {
  return await queryRows<{ account_id: string; transactions_count: string }>(
    [
      `SELECT account_id,
              SUM(outgoing_transactions_count) AS transactions_count
       FROM daily_outgoing_transactions_per_account_count
       WHERE collected_for_day >= DATE_TRUNC('day', NOW() - INTERVAL '2 week')
       GROUP BY account_id
       ORDER BY transactions_count DESC
       LIMIT 10`,
    ],
    { dataSource: DataSource.Analytics }
  );
};

const queryIndexedAccount = async (
  accountId: string
): Promise<{ account_id: string } | undefined> => {
  return await querySingleRow<{ account_id: string }, { account_id: string }>(
    [
      `SELECT account_id
       FROM accounts
       WHERE account_id = :account_id
       LIMIT 1`,
      { account_id: accountId },
    ],
    { dataSource: DataSource.Indexer }
  );
};

const queryAccountsList = async (
  limit: number = 15,
  paginationIndexer?: AccountPagination
): Promise<
  {
    account_id: string;
    account_index: string;
    created_at_block_timestamp: string;
  }[]
> => {
  return await queryRows<
    {
      account_id: string;
      account_index: string;
      created_at_block_timestamp: string;
    },
    {
      limit: number;
      account_index?: number;
    }
  >(
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
    { dataSource: DataSource.Indexer }
  );
};

const queryAccountOutcomeTransactionsCount = async (accountId: string) => {
  async function queryOutcomeTransactionsCountFromAnalytics(
    accountId: string
  ): Promise<{
    out_transactions_count: number;
    last_day_collected_timestamp?: string;
  }> {
    const query = await querySingleRow<
      {
        out_transactions_count: string;
        last_day_collected: Date;
      },
      {
        account_id: string;
      }
    >(
      [
        `SELECT SUM(outgoing_transactions_count) AS out_transactions_count,
                MAX(collected_for_day) AS last_day_collected
         FROM daily_outgoing_transactions_per_account_count
         WHERE account_id = :account_id`,
        { account_id: accountId },
      ],
      { dataSource: DataSource.Analytics }
    );
    const lastDayCollectedTimestamp = query?.last_day_collected
      ? new BN(query.last_day_collected.getTime())
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
    accountId: string,
    lastDayCollectedTimestamp?: string
  ): Promise<number> {
    // since analytics are collected for the previous day,
    // then 'lastDayCollectedTimestamp' may be 'null' for just created accounts so
    // we must put 'lastDayCollectedTimestamp' as below to dislay correct value
    const timestamp =
      lastDayCollectedTimestamp ||
      new BN(new Date().getTime())
        .sub(new BN(ONE_DAY_TIMESTAMP_MILISEC))
        .muln(10 ** 6)
        .toString();
    const query = await querySingleRow<
      { out_transactions_count: string },
      {
        account_id: string;
        timestamp: string;
      }
    >(
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
      { dataSource: DataSource.Indexer }
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

const queryAccountIncomeTransactionsCount = async (accountId: string) => {
  async function queryIncomeTransactionsCountFromAnalytics(
    accountId: string
  ): Promise<{
    in_transactions_count: number;
    last_day_collected_timestamp?: string;
  }> {
    const query = await querySingleRow<
      {
        in_transactions_count: string;
        last_day_collected: Date;
      },
      {
        account_id: string;
      }
    >(
      [
        `SELECT SUM(ingoing_transactions_count) as in_transactions_count,
                MAX(collected_for_day) AS last_day_collected
         FROM daily_ingoing_transactions_per_account_count
         WHERE account_id = :account_id`,
        { account_id: accountId },
      ],
      { dataSource: DataSource.Analytics }
    );
    const lastDayCollectedTimestamp = query?.last_day_collected
      ? new BN(query.last_day_collected.getTime())
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
    accountId: string,
    lastDayCollectedTimestamp?: string
  ): Promise<number> {
    // since analytics are collected for the previous day,
    // then 'lastDayCollectedTimestamp' may be 'null' for just created accounts so
    // we must put 'lastDayCollectedTimestamp' as below to dislay correct value
    const timestamp =
      lastDayCollectedTimestamp ||
      new BN(new Date().getTime())
        .sub(new BN(ONE_DAY_TIMESTAMP_MILISEC))
        .muln(10 ** 6)
        .toString();
    const query = await querySingleRow<
      { in_transactions_count: string },
      {
        requested_account_id: string;
        timestamp: string;
      }
    >(
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
      { dataSource: DataSource.Indexer }
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

export type AccountInfo = {
  account_id: string;
  created_at_block_timestamp: string;
  created_by_transaction_hash: string;
  deleted_at_block_timestamp: string | null;
  deleted_by_transaction_hash: string | null;
};

const queryAccountInfo = async (
  accountId: string
): Promise<AccountInfo | undefined> => {
  return await querySingleRow<AccountInfo, { account_id: string }>(
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
    { dataSource: DataSource.Indexer }
  );
};

// Not used yet
export type QueryAccountActivity = any;

const queryAccountActivity = async (
  accountId: string,
  limit: number = 100
): Promise<QueryAccountActivity[]> => {
  return await queryRows<
    QueryAccountActivity,
    { account_id: string; limit: number }
  >(
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
    { dataSource: DataSource.Indexer }
  );
};

// contracts
const queryNewContractsCountAggregatedByDate = async (): Promise<
  { date: Date; new_contracts_count_by_date: number }[]
> => {
  return await queryRows<{ date: Date; new_contracts_count_by_date: number }>(
    [
      `SELECT collected_for_day   AS date,
              new_contracts_count AS new_contracts_count_by_date
       FROM daily_new_contracts_count
       ORDER BY date`,
    ],
    { dataSource: DataSource.Analytics }
  );
};

const queryUniqueDeployedContractsCountAggregatedByDate = async (): Promise<
  { date: Date; contracts_count_by_date: number }[]
> => {
  return await queryRows<{ date: Date; contracts_count_by_date: number }>(
    [
      `SELECT collected_for_day          AS date,
              new_unique_contracts_count AS contracts_count_by_date
       FROM daily_new_unique_contracts_count
       ORDER BY date`,
    ],
    { dataSource: DataSource.Analytics }
  );
};

const queryActiveContractsCountAggregatedByDate = async (): Promise<
  {
    date: Date;
    active_contracts_count_by_date: number;
  }[]
> => {
  return await queryRows<{
    date: Date;
    active_contracts_count_by_date: number;
  }>(
    [
      `SELECT collected_for_day      AS date,
              active_contracts_count AS active_contracts_count_by_date
       FROM daily_active_contracts_count
       ORDER BY date`,
    ],
    { dataSource: DataSource.Analytics }
  );
};

const queryActiveContractsList = async (): Promise<
  { contract_id: string; receipts_count: string }[]
> => {
  return await queryRows<{ contract_id: string; receipts_count: string }>(
    [
      `SELECT contract_id,
              SUM(receipts_count) AS receipts_count
       FROM daily_receipts_per_contract_count
       WHERE collected_for_day >= DATE_TRUNC('day', NOW() - INTERVAL '2 week')
       GROUP BY contract_id
       ORDER BY receipts_count DESC
       LIMIT 10`,
    ],
    { dataSource: DataSource.Analytics }
  );
};

// query for partners
const queryPartnerTotalTransactions = async (): Promise<
  {
    receiver_account_id: string;
    transactions_count: string;
  }[]
> => {
  return await queryRows<
    {
      receiver_account_id: string;
      transactions_count: string;
    },
    {
      partner_list: string[];
    }
  >(
    [
      `SELECT
        receiver_account_id,
        COUNT(*) AS transactions_count
      FROM transactions
      WHERE receiver_account_id = ANY (:partner_list)
      GROUP BY receiver_account_id
      ORDER BY transactions_count DESC
      `,
      { partner_list: PARTNER_LIST },
    ],
    { dataSource: DataSource.Indexer }
  );
};

const queryPartnerFirstThreeMonthTransactions = async (): Promise<
  {
    receiver_account_id: string;
    transactions_count: string;
  }[]
> => {
  let partnerList = Array(PARTNER_LIST.length);
  for (let i = 0; i < PARTNER_LIST.length; i++) {
    let result = await querySingleRow<
      {
        receiver_account_id: string;
        transactions_count: string;
      },
      {
        partner: string;
      }
    >(
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
      { dataSource: DataSource.Indexer }
    );
    partnerList[i] = result;
  }
  return partnerList;
};

const queryLatestCirculatingSupply = async (): Promise<{
  circulating_tokens_supply: string;
  computed_at_block_timestamp: string;
}> => {
  const result = await querySingleRow<{
    circulating_tokens_supply: string;
    computed_at_block_timestamp: string;
  }>(
    [
      `SELECT circulating_tokens_supply, computed_at_block_timestamp
       FROM aggregated__circulating_supply
       ORDER BY computed_at_block_timestamp DESC
       LIMIT 1;`,
    ],
    { dataSource: DataSource.Indexer }
  );
  if (!result) {
    throw new Error(
      "No circulating tokens supply in aggregated__circulating_supply table of indexer"
    );
  }
  return result;
};

// pass 'days' to set period of calculation
const calculateFeesByDay = async (
  days: number = 1
): Promise<{ date: Date; fee: string } | undefined> => {
  if (!(days >= 1 && days <= 7)) {
    throw Error(
      "calculateFeesByDay can only handle `days` values in range 1..7"
    );
  }
  return await querySingleRow<{ date: Date; fee: string }>(
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
    { dataSource: DataSource.Indexer }
  );
};

const queryCirculatingSupply = async (): Promise<
  {
    date: Date;
    circulating_tokens_supply: string;
    total_tokens_supply: string;
  }[]
> => {
  return await queryRows<{
    date: Date;
    circulating_tokens_supply: string;
    total_tokens_supply: string;
  }>(
    [
      `SELECT
        DATE_TRUNC('day', TO_TIMESTAMP(DIV(computed_at_block_timestamp, 1000*1000*1000))) AS date,
        circulating_tokens_supply,
        total_tokens_supply
       FROM aggregated__circulating_supply
       ORDER BY date`,
    ],
    { dataSource: DataSource.Indexer }
  );
};

const queryFirstProducedBlockTimestamp = async (): Promise<{
  first_produced_block_timestamp: Date;
}> => {
  const result = await querySingleRow<{ first_produced_block_timestamp: Date }>(
    [
      `SELECT
        TO_TIMESTAMP(DIV(block_timestamp, 1000 * 1000 * 1000))::date AS first_produced_block_timestamp
       FROM blocks
       ORDER BY blocks.block_timestamp
       LIMIT 1`,
    ],
    { dataSource: DataSource.Indexer }
  );
  if (!result) {
    throw new Error("No blocks found");
  }
  return result;
};

// blocks
type QueryBlock = {
  hash: string;
  height: string;
  timestamp: string;
  prev_hash: string;
  transactions_count: string;
};

const queryBlocksList = async (
  limit: number = 15,
  paginationIndexer?: number
): Promise<QueryBlock[]> => {
  return await queryRows<
    QueryBlock,
    { limit: number; pagination_indexer?: string }
  >(
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
    { dataSource: DataSource.Indexer }
  );
};

type QueryBlockInfo = QueryBlock & {
  gas_price: string;
  total_supply: string;
  author_account_id: string;
};

const queryBlockInfo = async (
  blockId: string | number
): Promise<QueryBlockInfo | undefined> => {
  const searchCriteria = blockSearchCriteria(blockId);
  return await querySingleRow<QueryBlockInfo, { block_id: string | number }>(
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
    { dataSource: DataSource.Indexer }
  );
};

const queryBlockByHashOrId = async (
  blockId: string | number
): Promise<{ block_hash: string } | undefined> => {
  const searchCriteria = blockSearchCriteria(blockId);
  return await querySingleRow<
    { block_hash: string },
    { block_id: string | number }
  >(
    [
      `SELECT block_hash
       FROM blocks
       WHERE ${searchCriteria} = :block_id
       LIMIT 1`,
      { block_id: blockId },
    ],
    { dataSource: DataSource.Indexer }
  );
};

// receipts
const queryReceiptsCountInBlock = async (
  blockHash: string
): Promise<{ count: string } | undefined> => {
  return await querySingleRow<{ count: string }, { block_hash: string }>(
    [
      `SELECT
        COUNT(receipt_id)
       FROM receipts
       WHERE receipts.included_in_block_hash = :block_hash
       AND receipts.receipt_kind = 'ACTION'`,
      { block_hash: blockHash },
    ],
    { dataSource: DataSource.Indexer }
  );
};

const queryReceiptInTransaction = async (
  receiptId: string
): Promise<
  | {
      receipt_id: string;
      originated_from_transaction_hash: string;
    }
  | undefined
> => {
  return await querySingleRow<
    {
      receipt_id: string;
      originated_from_transaction_hash: string;
    },
    {
      receipt_id: string;
    }
  >(
    [
      `SELECT
        receipt_id, originated_from_transaction_hash
       FROM receipts
       WHERE receipt_id = :receipt_id
       LIMIT 1`,
      { receipt_id: receiptId },
    ],
    { dataSource: DataSource.Indexer }
  );
};

const queryIndexedTransaction = async (
  transactionHash: string
): Promise<{ transaction_hash: string } | undefined> => {
  return await querySingleRow<
    { transaction_hash: string },
    { transaction_hash: string }
  >(
    [
      `SELECT transaction_hash
       FROM transactions
       WHERE transaction_hash = :transaction_hash
       LIMIT 1`,
      { transaction_hash: transactionHash },
    ],
    { dataSource: DataSource.Indexer }
  );
};

export type QueryReceipt = {
  receipt_id: string;
  originated_from_transaction_hash: string;
  predecessor_id: string;
  receiver_id: string;
  status: string;
  gas_burnt: string;
  tokens_burnt: string;
  executed_in_block_timestamp: string;
  kind: string;
  args: Record<string, unknown>;
};

// expose receipts included in particular block
const queryIncludedReceiptsList = async (
  blockHash: string
): Promise<QueryReceipt[]> => {
  return await queryRows<QueryReceipt, { block_hash: string }>(
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
    { dataSource: DataSource.Indexer }
  );
};

// query receipts executed in particular block
const queryExecutedReceiptsList = async (
  blockHash: string
): Promise<QueryReceipt[]> => {
  return await queryRows<QueryReceipt, { block_hash: string }>(
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
       ORDER BY execution_outcomes.shard_id, execution_outcomes.index_in_chunk, action_receipt_actions.index_in_action_receipt`,
      { block_hash: blockHash },
    ],
    { dataSource: DataSource.Indexer }
  );
};

const queryContractInfo = async (accountId: string) => {
  // find the latest update in analytics db
  const latestUpdateResult = await querySingleRow<{
    latest_updated_timestamp: string;
  }>(
    [
      `SELECT deployed_at_block_timestamp AS latest_updated_timestamp
       FROM deployed_contracts
       ORDER BY deployed_at_block_timestamp DESC
       LIMIT 1`,
    ],
    { dataSource: DataSource.Analytics }
  );
  if (!latestUpdateResult) {
    throw new Error("No latest updated timestamp in DB");
  }
  const {
    latest_updated_timestamp: latestUpdatedTimestamp,
  } = latestUpdateResult;
  // query for the latest info from indexer
  // if it return 'undefined' then there was no update since deployed_at_block_timestamp
  const contractInfoFromIndexer = await querySingleRow<
    {
      block_timestamp: string;
      hash: string;
    },
    {
      account_id: string;
      timestamp: string;
    }
  >(
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
    { dataSource: DataSource.Indexer }
  );

  if (contractInfoFromIndexer) {
    return {
      block_timestamp: contractInfoFromIndexer.block_timestamp,
      hash: contractInfoFromIndexer.hash,
    };
  }

  // query to analytics db to find latest historical record
  const contractInfoFromAnalytics = await querySingleRow<
    {
      receipt_id: string;
      block_timestamp: string;
    },
    { account_id: string }
  >(
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
    { dataSource: DataSource.Analytics }
  );

  if (!contractInfoFromAnalytics) {
    throw new Error(
      `Contract info from analytics DB not found on account ${accountId}`
    );
  }

  // query for transaction hash where contact was deployed
  const transactionHashResult = await querySingleRow<
    { hash: string },
    { receipt_id: string }
  >(
    [
      `SELECT originated_from_transaction_hash AS hash
        FROM receipts
        WHERE receipt_id = :receipt_id
        LIMIT 1`,
      { receipt_id: contractInfoFromAnalytics.receipt_id },
    ],
    { dataSource: DataSource.Indexer }
  );

  if (!transactionHashResult) {
    throw new Error(
      `Transaction hash from analytics DB not found on account ${accountId}`
    );
  }

  if (contractInfoFromAnalytics) {
    return {
      block_timestamp: contractInfoFromAnalytics.block_timestamp,
      hash: transactionHashResult.hash,
    };
  }
  return undefined;
};

// chunks
const queryGasUsedInChunks = async (blockHash: string) => {
  return await querySingleRow<{ gas_used: string }, { block_hash: string }>(
    [
      `SELECT SUM(gas_used) AS gas_used
       FROM chunks
       WHERE included_in_block_hash = :block_hash`,
      { block_hash: blockHash },
    ],
    { dataSource: DataSource.Indexer }
  );
};

// node part
export { queryOnlineNodes, extendWithTelemetryInfo, queryNodeValidators };

// genesis
export { queryGenesisAccountCount };

// dashboard
export {
  queryTransactionsCountHistoryForTwoWeeks,
  queryRecentTransactionsCount,
  queryDashboardBlocksStats,
};

// transaction related
export {
  queryTransactionsCountAggregatedByDate,
  queryGasUsedAggregatedByDate,
  queryDepositAmountAggregatedByDate,
  queryIndexedTransaction,
  queryTransactionsList,
  queryTransactionsActionsList,
  queryAccountTransactionsList,
  queryTransactionsListInBlock,
  queryTransactionInfo,
};

// accounts
export {
  queryNewAccountsCountAggregatedByDate,
  queryDeletedAccountsCountAggregatedByDate,
  queryActiveAccountsCountAggregatedByDate,
  queryActiveAccountsList,
  queryActiveAccountsCountAggregatedByWeek,
  queryIndexedAccount,
  queryAccountsList,
  queryAccountInfo,
  queryAccountOutcomeTransactionsCount,
  queryAccountIncomeTransactionsCount,
  queryAccountActivity,
};

// blocks
export {
  queryFirstProducedBlockTimestamp,
  queryBlocksList,
  queryBlockInfo,
  queryBlockByHashOrId,
};

// contracts
export {
  queryNewContractsCountAggregatedByDate,
  queryUniqueDeployedContractsCountAggregatedByDate,
  queryActiveContractsCountAggregatedByDate,
  queryActiveContractsList,
  queryContractInfo,
};

// partner
export {
  queryPartnerTotalTransactions,
  queryPartnerFirstThreeMonthTransactions,
};

// circulating supply
export { queryLatestCirculatingSupply, queryCirculatingSupply };

// calculate fee
export { calculateFeesByDay };

// receipts
export {
  queryReceiptsCountInBlock,
  queryReceiptInTransaction,
  queryIncludedReceiptsList,
  queryExecutedReceiptsList,
};

// chunks
export { queryGasUsedInChunks };
