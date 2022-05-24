import {
  SubscriptionTopicType,
  SubscriptionTopicTypes,
  ValidatorEpochData,
  ValidatorPoolInfo,
} from "./types";
import { config } from "./config";
import {
  queryStakingPoolAccountIds,
  queryRecentTransactionsCount,
  queryTelemetryInfo,
  queryTransactionsCountHistoryForTwoWeeks,
  queryLatestBlockHeight,
  queryLatestGasPrice,
  queryRecentBlockProductionSpeed,
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
  aggregateTransactionsCountByDate,
  aggregateUniqueDeployedContractsCountByDate,
} from "./stats";
import { wait } from "./common";
import { Context } from "./context";
import { GlobalState } from "./global-state";
import { CachedTimestampMap } from "./check-utils";

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

export type RegularCheckFn = {
  description: string;
  fn: (publish: Context["publishWamp"], context: Context) => Promise<void>;
  interval: number;
  shouldSkip?: () => void;
};

const VALIDATOR_DESCRIPTION_QUERY_AMOUNT = 100;

const chainBlockStatsCheck: RegularCheckFn = {
  description: "block stats check from Indexer",
  fn: async (publish) => {
    const [
      latestBlockHeight,
      latestGasPrice,
      recentBlockProductionSpeed,
    ] = await Promise.all([
      queryLatestBlockHeight(),
      queryLatestGasPrice(),
      queryRecentBlockProductionSpeed(),
    ]);
    void publish("chain-blocks-stats", {
      latestBlockHeight,
      latestGasPrice,
      recentBlockProductionSpeed,
    });
  },
  interval: config.intervals.checkChainBlockStats,
};

const recentTransactionsCountCheck: RegularCheckFn = {
  description: "recent transactions check from Indexer",
  fn: async (publish) => {
    void publish("recent-transactions", {
      recentTransactionsCount: await queryRecentTransactionsCount(),
    });
  },
  interval: config.intervals.checkRecentTransactions,
};

const transactionCountHistoryCheck: RegularCheckFn = {
  description: "transaction count history for 2 weeks",
  fn: async (_, context) => {
    context.state.transactionsCountHistoryForTwoWeeks = await queryTransactionsCountHistoryForTwoWeeks();
  },
  interval: config.intervals.checkTransactionCountHistory,
};

const statsAggregationCheck: RegularCheckFn = {
  description: "stats aggregation",
  fn: async () => {
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
  },
  interval: config.intervals.checkAggregatedStats,
};

const finalityStatusCheck: RegularCheckFn = {
  description: "publish finality status",
  fn: async (publish) => {
    const finalBlock = await queryFinalBlock();
    void publish("finality-status", {
      finalBlockTimestampNanosecond: finalBlock.header.timestamp_nanosec,
      finalBlockHeight: finalBlock.header.height,
    });
  },
  interval: config.intervals.checkFinalityStatus,
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
    config.intervals.checkStakingPoolStakeProposal,
    config.timeouts.timeoutStakingPoolStakeProposal
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
    config.intervals.checkStakingPoolInfo,
    config.timeouts.timeoutStakingPoolsInfo
  );
};

const networkInfoCheck: RegularCheckFn = {
  description: "publish network info",
  fn: async (publish, context) => {
    const epochData = await queryEpochData(context.state.poolIds);
    const telemetryInfo = await queryTelemetryInfo(
      epochData.validators.map((validator) => validator.accountId)
    );
    await Promise.all([
      Promise.race([
        updateStakingPoolStakeProposalsFromContractMap(
          epochData.validators,
          context.state
        ),
        wait(config.timeouts.timeoutFetchValidatorsBailout),
      ]),
      Promise.race([
        updatePoolInfoMap(epochData.validators, context.state),
        wait(config.timeouts.timeoutFetchValidatorsBailout),
      ]),
    ]);
    void publish("validators", {
      validators: epochData.validators.map((validator) => ({
        ...validator,
        description: context.state.stakingPoolsDescriptions.get(
          validator.accountId
        ),
        poolInfo: context.state.stakingPoolInfos.valueMap.get(
          validator.accountId
        ),
        contractStake: context.state.stakingPoolStakeProposalsFromContract.valueMap.get(
          validator.accountId
        ),
        telemetry: telemetryInfo.get(validator.accountId),
      })),
    });
    void publish("network-stats", epochData.stats);
  },
  interval: config.intervals.checkNetworkInfo,
};

const stakingPoolMetadataInfoCheck: RegularCheckFn = {
  description: "staking pool metadata check",
  fn: async (_, context) => {
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
        context.state.stakingPoolsDescriptions.set(accountId, {
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
  interval: config.intervals.checkValidatorDescriptions,
  shouldSkip: () => config.networkName !== "mainnet",
};

const poolIdsCheck: RegularCheckFn = {
  description: "pool ids check",
  fn: async (_, context) => {
    context.state.poolIds = await queryStakingPoolAccountIds();
  },
  interval: config.intervals.checkPoolIds,
};

const regularChecks: RegularCheckFn[] = [
  chainBlockStatsCheck,
  recentTransactionsCountCheck,
  transactionCountHistoryCheck,
  statsAggregationCheck,
  finalityStatusCheck,
  networkInfoCheck,
  stakingPoolMetadataInfoCheck,
  poolIdsCheck,
];

export const runChecks = (context: Context) => {
  const timeouts: Record<string, NodeJS.Timeout> = {};
  for (const check of regularChecks) {
    if (check.shouldSkip?.()) {
      continue;
    }

    const runCheck = async () => {
      try {
        await check.fn(context.publishWamp, context);
      } catch (error) {
        console.warn(
          `Regular ${check.description} crashed due to:`,
          String(error)
        );
      } finally {
        setTimeoutBound();
      }
    };
    const setTimeoutBound = () => {
      timeouts[check.description] = setTimeout(runCheck, check.interval);
    };
    void runCheck();
  }
  return () => {
    const timeoutIds = Object.values(timeouts);
    timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
  };
};
