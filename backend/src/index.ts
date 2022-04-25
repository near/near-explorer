import {
  regularPublishFinalityStatusInterval,
  regularQueryStatsInterval,
  regularPublishNetworkInfoInterval,
  regularFetchStakingPoolsInfoInterval,
  regularStatsInterval,
  wampNearNetworkName,
  regularFetchStakingPoolsMetadataInfoInterval,
  regularPublishTransactionCountForTwoWeeksInterval,
  fetchStakingPoolsInfoThrowawayTimeout,
} from "./config";

import {
  queryFinalBlock,
  queryEpochData,
  callViewMethod,
  sendJsonRpcQuery,
} from "./near";

import { setupWamp, wampPublish } from "./wamp";

import {
  queryTelemetryInfo,
  queryDashboardBlocksStats,
  queryTransactionsCountHistoryForTwoWeeks,
  queryRecentTransactionsCount,
} from "./db-utils";

import {
  aggregateGasUsedByDate,
  aggregateTransactionsCountByDate,
  aggregateNewAccountsCountByDate,
  aggregateDeletedAccountsCountByDate,
  aggregateNewContractsCountByDate,
  aggregateUniqueDeployedContractsCountByDate,
  aggregateActiveContractsCountByDate,
  aggregateActiveAccountsCountByDate,
  aggregateActiveAccountsCountByWeek,
  aggregateActiveAccountsList,
  aggregateActiveContractsList,
  aggregatePartnerTotalTransactionsCount,
  aggregatePartnerFirst3MonthTransactionsCount,
  aggregateDepositAmountByDate,
  aggregateLiveAccountsCountByDate,
  aggregateCirculatingSupplyByDate,
} from "./stats";
import autobahn from "autobahn";
import {
  ValidatorPoolInfo,
  ValidatorDescription,
  ValidatorEpochData,
} from "./client-types";
import { formatDate, trimError, wait } from "./utils";
import { databases, withPool } from "./db";
import { TELEMETRY_CREATE_TABLE_QUERY } from "./telemetry";

type PoolMetadataAccountId = string;
// See https://github.com/zavodil/near-pool-details/blob/master/FIELDS.md
type PoolMetadataAccountInfo = {
  description?: string;
  logo?: string;
  name?: string;
  country_code: string;
  url?: string;
  twitter?: string;
  email?: string;
  telegram?: string;
  discord?: string;
  country?: string;
  city?: string;
  github?: string;
};
type PoolMetadataInfo = Record<PoolMetadataAccountId, PoolMetadataAccountInfo>;

const VALIDATOR_DESCRIPTION_QUERY_AMOUNT = 100;

let transactionsCountHistoryForTwoWeeks: { date: Date; total: number }[] = [];
let stakingPoolsMetadataInfo: Map<string, ValidatorDescription> = new Map();

type CachedTimestampMap<T> = {
  timestampMap: Map<string, number>;
  map: Map<string, T>;
  promisesMap: Map<string, Promise<T | undefined>>;
};

const contractBalances: CachedTimestampMap<string> = {
  timestampMap: new Map(),
  map: new Map(),
  promisesMap: new Map(),
};
const poolInfos: CachedTimestampMap<ValidatorPoolInfo> = {
  timestampMap: new Map(),
  map: new Map(),
  promisesMap: new Map(),
};

function startDataSourceSpecificJobs(
  getSession: () => Promise<autobahn.Session>
): void {
  const regularCheckDataStats = async (): Promise<void> => {
    try {
      const blocksStats = await queryDashboardBlocksStats();
      const recentTransactionsCount = await queryRecentTransactionsCount();

      void wampPublish("chain-blocks-stats", blocksStats, getSession);
      if (recentTransactionsCount) {
        void wampPublish(
          "chain-transactions-stats",
          {
            transactionsCountHistoryForTwoWeeks: transactionsCountHistoryForTwoWeeks.map(
              ({ date, total }) => ({
                date: formatDate(date),
                total,
              })
            ),
            recentTransactionsCount,
          },
          getSession
        );
      }
    } catch (error) {
      console.warn(
        `Regular data stats check from Indexer is crashed due to: ${trimError(
          error
        )}`
      );
    }
    setTimeout(regularCheckDataStats, regularQueryStatsInterval);
  };
  setTimeout(regularCheckDataStats, 0);
}

function startStatsAggregation(): void {
  const regularStatsAggregate = async (): Promise<void> => {
    try {
      //stats part
      // circulating supply
      await aggregateCirculatingSupplyByDate();

      // transactions related
      await aggregateTransactionsCountByDate();
      await aggregateGasUsedByDate();
      await aggregateDepositAmountByDate();

      // account
      await aggregateNewAccountsCountByDate();
      await aggregateDeletedAccountsCountByDate();
      await aggregateLiveAccountsCountByDate();
      await aggregateActiveAccountsCountByDate();
      await aggregateActiveAccountsCountByWeek();
      await aggregateActiveAccountsList();

      // contract
      await aggregateNewContractsCountByDate();
      await aggregateActiveContractsCountByDate();
      await aggregateUniqueDeployedContractsCountByDate();
      await aggregateActiveContractsList();

      //partner part
      await aggregatePartnerTotalTransactionsCount();
      await aggregatePartnerFirst3MonthTransactionsCount();
    } catch (error) {
      console.warn("Regular Stats Aggregation is crashed due to:", error);
    }
    setTimeout(regularStatsAggregate, regularStatsInterval);
  };
  setTimeout(regularStatsAggregate, 0);
}

const updateValidatorDescriptions = async (
  map: Map<string, ValidatorDescription>
): Promise<void> => {
  let currentIndex = 0;
  while (true) {
    const metadataInfo = await callViewMethod<PoolMetadataInfo>(
      "name.near",
      "get_all_fields",
      {
        from_index: currentIndex,
        limit: VALIDATOR_DESCRIPTION_QUERY_AMOUNT,
      }
    );
    const entries = Object.entries(metadataInfo);
    if (entries.length === 0) {
      return;
    }
    for (const [accountId, poolMetadataInfo] of entries) {
      map.set(accountId, {
        country: poolMetadataInfo.country,
        countryCode: poolMetadataInfo.country_code,
        description: poolMetadataInfo.description,
        discord: poolMetadataInfo.discord,
        email: poolMetadataInfo.email,
        twitter: poolMetadataInfo.twitter,
        url: poolMetadataInfo.url,
      });
    }
    currentIndex += VALIDATOR_DESCRIPTION_QUERY_AMOUNT;
  }
};

const getValidatorContractBalance = async (
  id: string
): Promise<string | undefined> => {
  // for some accounts on 'testnet' we can't get 'currentStake'
  // because they looks like pool accounts but they are not so
  // that's why we catch this error to avoid unnecessary errors in console
  return callViewMethod<string>(id, "get_total_staked_balance", {}).catch(
    () => undefined
  );
};

const getPoolInfo = async (id: string): Promise<ValidatorPoolInfo> => {
  const account = await sendJsonRpcQuery("view_account", {
    account_id: id,
    finality: "final",
  });

  // 'code_hash' === 11111111111111111111111111111111 is when the validator
  // does not have a staking-pool contract on it (common on testnet)
  if (account.code_hash === "11111111111111111111111111111111") {
    return {
      fee: null,
      delegatorsCount: null,
    };
  }
  return {
    // for some accounts on 'testnet' we can't get 'fee' and 'delegatorsCount'
    // because they looks like pool accounts but they are not so
    // that's why we catch this error to avoid unnecessary errors in console
    fee: await callViewMethod<ValidatorPoolInfo["fee"]>(
      id,
      "get_reward_fee_fraction",
      {}
    ).catch(() => null),
    delegatorsCount: await callViewMethod<ValidatorPoolInfo["delegatorsCount"]>(
      id,
      "get_number_of_accounts",
      {}
    ).catch(() => null),
  };
};

const getRegularlyFetchedMap = async <T>(
  ids: string[],
  mappings: CachedTimestampMap<T>,
  fetchFn: (id: string) => Promise<T>,
  refetchInterval: number,
  throwAwayTimeout: number
): Promise<void> => {
  const getPromise = async (id: string) => {
    try {
      const result = await fetchFn(id);
      mappings.map.set(id, result);
      return result;
    } catch (e) {
      mappings.promisesMap.delete(id);
    }
  };
  for (const id of ids) {
    mappings.timestampMap.set(id, Date.now());
    if (!mappings.promisesMap.get(id)) {
      mappings.promisesMap.set(id, getPromise(id));
      const intervalId = setInterval(() => {
        const lastTimestamp = mappings.timestampMap.get(id) || 0;
        if (Date.now() - lastTimestamp <= throwAwayTimeout) {
          mappings.promisesMap.set(id, getPromise(id));
        } else {
          mappings.promisesMap.delete(id);
          clearInterval(intervalId);
        }
      }, refetchInterval);
    }
  }
  await Promise.all(ids.map((id) => mappings.promisesMap.get(id)));
};

const getContractStakeMap = async (
  validators: ValidatorEpochData[],
  cachedTimestampMap: CachedTimestampMap<string>
): Promise<void> => {
  return getRegularlyFetchedMap(
    validators
      .filter((validator) => !validator.currentEpoch)
      .map((validator) => validator.accountId),
    cachedTimestampMap,
    getValidatorContractBalance,
    regularFetchStakingPoolsInfoInterval,
    fetchStakingPoolsInfoThrowawayTimeout
  );
};

const getPoolInfoMap = async (
  validators: ValidatorEpochData[],
  cachedTimestampMap: CachedTimestampMap<ValidatorPoolInfo>
): Promise<void> => {
  return getRegularlyFetchedMap(
    validators.map((validator) => validator.accountId),
    cachedTimestampMap,
    getPoolInfo,
    regularFetchStakingPoolsInfoInterval,
    fetchStakingPoolsInfoThrowawayTimeout
  );
};

async function main(): Promise<void> {
  console.log("Starting Explorer backend & WAMP listener...");
  const getSession = setupWamp();

  // Skip initializing Telemetry database if the backend is not configured to
  // save telemety data (it is absolutely fine for local development)
  if (databases.telemetryBackendWriteOnlyPool) {
    await withPool(databases.telemetryBackendWriteOnlyPool, (client) =>
      client.query(TELEMETRY_CREATE_TABLE_QUERY)
    );
  }

  // regular transactions count
  const regularPublishTransactionsCount = async (): Promise<void> => {
    try {
      transactionsCountHistoryForTwoWeeks = await queryTransactionsCountHistoryForTwoWeeks();
    } catch (error) {
      console.warn(
        "Regular transactions count for week crashed due to:",
        error
      );
    }
    setTimeout(
      regularPublishTransactionsCount,
      regularPublishTransactionCountForTwoWeeksInterval
    );
  };
  setTimeout(regularPublishTransactionsCount, 0);

  // regularly publish the latest information about the height and timestamp of the final block
  const regularPublishFinalityStatus = async (): Promise<void> => {
    try {
      const finalBlock = await queryFinalBlock();
      void wampPublish(
        "finality-status",
        {
          finalBlockTimestampNanosecond: finalBlock.header.timestamp_nanosec,
          finalBlockHeight: finalBlock.header.height,
        },
        getSession
      );
    } catch (error) {
      console.warn("Regular final timestamp check crashed due to:", error);
    }
    setTimeout(
      regularPublishFinalityStatus,
      regularPublishFinalityStatusInterval
    );
  };
  setTimeout(regularPublishFinalityStatus, 0);

  // regularly publish information about validators, proposals, staking pools, and online nodes
  const regularPublishNetworkInfo = async (): Promise<void> => {
    try {
      const epochData = await queryEpochData();
      const telemetryInfo = await queryTelemetryInfo(
        epochData.validators.map((validator) => validator.accountId)
      );
      await Promise.all([
        Promise.race([
          getContractStakeMap(epochData.validators, contractBalances),
          wait(2500),
        ]),
        Promise.race([
          getPoolInfoMap(epochData.validators, poolInfos),
          wait(2500),
        ]),
      ]);
      void wampPublish(
        "validators",
        {
          validators: epochData.validators.map((validator) => ({
            ...validator,
            description: stakingPoolsMetadataInfo.get(validator.accountId),
            poolInfo: poolInfos.map.get(validator.accountId),
            contractStake: contractBalances.map.get(validator.accountId),
            telemetry: telemetryInfo.get(validator.accountId),
          })),
        },
        getSession
      );
      void wampPublish("network-stats", epochData.stats, getSession);
    } catch (error) {
      console.warn("Regular network info publishing crashed due to:", error);
    }
    setTimeout(regularPublishNetworkInfo, regularPublishNetworkInfoInterval);
  };
  setTimeout(regularPublishNetworkInfo, 0);

  function startRegularFetchStakingPoolsMetadataInfo(): void {
    const regularFetchStakingPoolsMetadataInfo = async (): Promise<void> => {
      try {
        await updateValidatorDescriptions(stakingPoolsMetadataInfo);
      } catch (error) {
        console.warn(
          "Regular fetching staking pools metadata info crashed due to:",
          error
        );
      }
      setTimeout(
        regularFetchStakingPoolsMetadataInfo,
        regularFetchStakingPoolsMetadataInfoInterval
      );
    };
    setTimeout(regularFetchStakingPoolsMetadataInfo, 0);
  }

  startDataSourceSpecificJobs(getSession);
  startStatsAggregation();

  if (wampNearNetworkName === "mainnet") {
    startRegularFetchStakingPoolsMetadataInfo();
  }
}

void main();
