import { ValidatorEpochData, ValidatorPoolInfo } from "../router/types";
import { config } from "../config";
import {
  queryStakingPoolAccountIds,
  queryRecentTransactionsCount,
  queryTelemetryInfo,
  queryTransactionsCountHistoryForTwoWeeks,
  queryLatestBlock,
  queryLatestGasPrice,
  queryRecentBlockProductionSpeed,
} from "../database/queries";
import { callViewMethod, sendJsonRpcQuery } from "../utils/near";
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
} from "../providers/stats";
import { queryEpochData } from "../providers/network";
import { wait } from "../common";
import { GlobalState } from "../global-state";
import { RegularCheckFn } from "./types";
import { publishOnChange, updateRegularlyFetchedMap } from "./utils";

export const latestBlockCheck: RegularCheckFn = {
  description: "publish finality status",
  fn: publishOnChange(
    "latestBlock",
    queryLatestBlock,
    config.intervals.checkLatestBlock
  ),
};

export const latestGasPriceCheck: RegularCheckFn = {
  description: "latest gas price check from Indexer",
  fn: publishOnChange(
    "latestGasPrice",
    queryLatestGasPrice,
    config.intervals.checkLatestGasPrice
  ),
};

export const blockProductionSpeedCheck: RegularCheckFn = {
  description: "block production speed check from Indexer",
  fn: publishOnChange(
    "blockProductionSpeed",
    queryRecentBlockProductionSpeed,
    config.intervals.checkBlockProductionSpeed
  ),
};

export const recentTransactionsCountCheck: RegularCheckFn = {
  description: "recent transactions check from Indexer",
  fn: publishOnChange(
    "recentTransactionsCount",
    queryRecentTransactionsCount,
    config.intervals.checkRecentTransactions
  ),
};

export const transactionCountHistoryCheck: RegularCheckFn = {
  description: "transaction count history for 2 weeks",
  fn: async (_, context) => {
    context.state.transactionsCountHistoryForTwoWeeks = await queryTransactionsCountHistoryForTwoWeeks();
    return config.intervals.checkTransactionCountHistory;
  },
};

export const statsAggregationCheck: RegularCheckFn = {
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

    return config.intervals.checkAggregatedStats;
  },
};

export const updateStakingPoolStakeProposalsFromContractMap = async (
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

export const updatePoolInfoMap = async (
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

export const networkInfoCheck: RegularCheckFn = {
  description: "publish network info",
  fn: async (publish, context) => {
    const epochData = await queryEpochData(
      context.state.poolIds,
      context.state.currentEpochState
    );
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
    publish("validators", {
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
    publish("network-stats", epochData.stats);
    return config.intervals.checkNetworkInfo;
  },
};

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

const VALIDATOR_DESCRIPTION_QUERY_AMOUNT = 100;
export const stakingPoolMetadataInfoCheck: RegularCheckFn = {
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
        return config.intervals.checkValidatorDescriptions;
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
  shouldSkip: () => config.networkName !== "mainnet",
};

export const poolIdsCheck: RegularCheckFn = {
  description: "pool ids check",
  fn: async (_, context) => {
    context.state.poolIds = await queryStakingPoolAccountIds();
    return config.intervals.checkPoolIds;
  },
};
