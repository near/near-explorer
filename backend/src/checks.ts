import autobahn from "autobahn";

import {
  ValidatorDescription,
  ValidatorEpochData,
  ValidatorPoolInfo,
} from "./client-types";
import { INTERVALS, wampNearNetworkName } from "./config";
import {
  queryDashboardBlocksStats,
  queryRecentTransactionsCount,
  queryTelemetryInfo,
  queryTransactionsCountHistoryForTwoWeeks,
} from "./db-utils";
import {
  callViewMethod,
  queryEpochData,
  queryFinalBlock,
  sendJsonRpcQuery,
} from "./near";
import {
  aggregateActiveAccountsCountByDate,
  aggregateActiveAccountsCountByWeek,
  aggregateActiveAccountsList,
  aggregateActiveContractsCountByDate,
  aggregateActiveContractsList,
  aggregateCirculatingSupplyByDate,
  aggregateDeletedAccountsCountByDate,
  aggregateDepositAmountByDate,
  aggregateGasUsedByDate,
  aggregateLiveAccountsCountByDate,
  aggregateNewAccountsCountByDate,
  aggregateNewContractsCountByDate,
  aggregatePartnerFirst3MonthTransactionsCount,
  aggregatePartnerTotalTransactionsCount,
  aggregateTransactionsCountByDate,
  aggregateUniqueDeployedContractsCountByDate,
} from "./stats";
import { formatDate, wait } from "./utils";
import { wampPublish } from "./wamp";

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

export type CachedTimestampMap<T> = {
  timestampMap: Map<string, number>;
  valueMap: Map<string, T>;
  promisesMap: Map<string, Promise<void>>;
};

export type GlobalState = {
  transactionsCountHistoryForTwoWeeks: { date: Date; total: number }[];
  stakingPoolsDescriptions: Map<string, ValidatorDescription>;
  stakingPoolStakeProposalsFromContract: CachedTimestampMap<string>;
  stakingPoolInfos: CachedTimestampMap<ValidatorPoolInfo>;
};

export type RegularCheckFn = {
  description: string;
  fn: (
    getSession: () => Promise<autobahn.Session>,
    state: GlobalState
  ) => Promise<void>;
  interval: number;
  shouldSkip?: () => void;
};

const VALIDATOR_DESCRIPTION_QUERY_AMOUNT = 100;

const chainBlockStatsCheck: RegularCheckFn = {
  description: "block stats check from Indexer",
  fn: async (getSession) => {
    void wampPublish(
      "chain-blocks-stats",
      await queryDashboardBlocksStats(),
      getSession
    );
  },
  interval: INTERVALS.checkChainBlockStats,
};

const recentTransactionsCountCheck: RegularCheckFn = {
  description: "recent transactions check from Indexer",
  fn: async (getSession) => {
    void wampPublish(
      "recent-transactions",
      { recentTransactionsCount: await queryRecentTransactionsCount() },
      getSession
    );
  },
  interval: INTERVALS.checkRecentTransactions,
};

const transactionCountHistoryCheck: RegularCheckFn = {
  description: "transaction count history for 2 weeks",
  fn: async (getSession, state) => {
    const history = await queryTransactionsCountHistoryForTwoWeeks();
    state.transactionsCountHistoryForTwoWeeks = history;
    void wampPublish(
      "transaction-history",
      {
        transactionsCountHistoryForTwoWeeks: history.map(({ date, total }) => ({
          date: formatDate(date),
          total,
        })),
      },
      getSession
    );
  },
  interval: INTERVALS.checkTransactionCountHistory,
};

const statsAggregationCheck: RegularCheckFn = {
  description: "stats aggregation",
  fn: async () => {
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
  },
  interval: INTERVALS.checkAggregatedStats,
};

const finalityStatusCheck: RegularCheckFn = {
  description: "publish finality status",
  fn: async (getSession) => {
    const finalBlock = await queryFinalBlock();
    void wampPublish(
      "finality-status",
      {
        finalBlockTimestampNanosecond: finalBlock.header.timestamp_nanosec,
        finalBlockHeight: finalBlock.header.height,
      },
      getSession
    );
  },
  interval: INTERVALS.checkFinalityStatus,
};

const updateRegularlyFetchedMap = async <T>(
  ids: string[],
  mappings: CachedTimestampMap<T>,
  fetchFn: (id: string) => Promise<T>,
  refetchInterval: number,
  throwAwayTimeout: number
): Promise<void> => {
  const updatePromise = async (id: string) => {
    try {
      const result = await fetchFn(id);
      mappings.valueMap.set(id, result);
    } catch (e) {
      mappings.promisesMap.delete(id);
    }
  };
  for (const id of ids) {
    mappings.timestampMap.set(id, Date.now());
    if (!mappings.promisesMap.get(id)) {
      mappings.promisesMap.set(id, updatePromise(id));
      const intervalId = setInterval(() => {
        const lastTimestamp = mappings.timestampMap.get(id) || 0;
        if (Date.now() - lastTimestamp <= throwAwayTimeout) {
          mappings.promisesMap.set(id, updatePromise(id));
        } else {
          mappings.promisesMap.delete(id);
          clearInterval(intervalId);
        }
      }, refetchInterval);
    }
  }
  await Promise.all(ids.map((id) => mappings.promisesMap.get(id)));
};

const updateStakingPoolStakeProposalsFromContractMap = async (
  validators: ValidatorEpochData[],
  state: GlobalState
): Promise<void> => {
  return updateRegularlyFetchedMap(
    validators
      .filter((validator) => !validator.currentEpoch)
      .map((validator) => validator.accountId),
    state.stakingPoolStakeProposalsFromContract,
    // for some accounts on 'testnet' we can't get 'currentStake'
    // because they looks like pool accounts but they are not so
    // that's why we catch this error to avoid unnecessary errors in console
    async (id) =>
      callViewMethod<string>(id, "get_total_staked_balance", {}).catch(
        () => undefined
      ),
    INTERVALS.checkStakingPoolStakeProposal,
    INTERVALS.timeoutStakingPoolStakeProposal
  );
};

const updatePoolInfoMap = async (
  validators: ValidatorEpochData[],
  state: GlobalState
): Promise<void> => {
  return updateRegularlyFetchedMap(
    validators.map((validator) => validator.accountId),
    state.stakingPoolInfos,
    async (id) => {
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
        delegatorsCount: await callViewMethod<
          ValidatorPoolInfo["delegatorsCount"]
        >(id, "get_number_of_accounts", {}).catch(() => null),
      };
    },
    INTERVALS.checkStakingPoolInfo,
    INTERVALS.timeoutStakingPoolsInfo
  );
};

const networkInfoCheck: RegularCheckFn = {
  description: "publish network info",
  fn: async (getSession, state) => {
    const epochData = await queryEpochData();
    const telemetryInfo = await queryTelemetryInfo(
      epochData.validators.map((validator) => validator.accountId)
    );
    await Promise.all([
      Promise.race([
        updateStakingPoolStakeProposalsFromContractMap(
          epochData.validators,
          state
        ),
        wait(INTERVALS.timeoutFetchValidatorsBailout),
      ]),
      Promise.race([
        updatePoolInfoMap(epochData.validators, state),
        wait(INTERVALS.timeoutFetchValidatorsBailout),
      ]),
    ]);
    void wampPublish(
      "validators",
      {
        validators: epochData.validators.map((validator) => ({
          ...validator,
          description: state.stakingPoolsDescriptions.get(validator.accountId),
          poolInfo: state.stakingPoolInfos.valueMap.get(validator.accountId),
          contractStake: state.stakingPoolStakeProposalsFromContract.valueMap.get(
            validator.accountId
          ),
          telemetry: telemetryInfo.get(validator.accountId),
        })),
      },
      getSession
    );
    void wampPublish("network-stats", epochData.stats, getSession);
  },
  interval: INTERVALS.checkNetworkInfo,
};

const stakingPoolMetadataInfoCheck: RegularCheckFn = {
  description: "staking pool metadata check",
  fn: async (_, state) => {
    for (
      let currentIndex = 0;
      true;
      currentIndex += VALIDATOR_DESCRIPTION_QUERY_AMOUNT
    ) {
      const metadataInfo = await callViewMethod<
        Record<string, PoolMetadataAccountInfo>
      >("name.near", "get_all_fields", {
        from_index: currentIndex,
        limit: VALIDATOR_DESCRIPTION_QUERY_AMOUNT,
      });
      const entries = Object.entries(metadataInfo);
      if (entries.length === 0) {
        return;
      }
      for (const [accountId, poolMetadataInfo] of entries) {
        state.stakingPoolsDescriptions.set(accountId, {
          country: poolMetadataInfo.country,
          countryCode: poolMetadataInfo.country_code,
          description: poolMetadataInfo.description,
          discord: poolMetadataInfo.discord,
          email: poolMetadataInfo.email,
          twitter: poolMetadataInfo.twitter,
          url: poolMetadataInfo.url,
        });
      }
    }
  },
  interval: INTERVALS.checkValidatorDescriptions,
  shouldSkip: () => wampNearNetworkName !== "mainnet",
};

export const regularChecks: RegularCheckFn[] = [
  chainBlockStatsCheck,
  recentTransactionsCountCheck,
  transactionCountHistoryCheck,
  statsAggregationCheck,
  finalityStatusCheck,
  networkInfoCheck,
  stakingPoolMetadataInfoCheck,
];
