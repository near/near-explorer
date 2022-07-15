import moment from "moment";
import { ValidatorEpochData, ValidatorPoolInfo } from "../router/types";
import { config } from "../config";
import {
  queryStakingPoolAccountIds,
  queryRecentTransactionsCount,
  queryTelemetryInfo,
  queryTransactionsHistory,
  queryLatestBlock,
  queryLatestGasPrice,
  queryRecentBlockProductionSpeed,
  queryOnlineNodesCount,
  queryGenesisAccountCount,
  queryTokensSupply,
  queryGasUsedAggregatedByDate,
  queryNewAccountsCountAggregatedByDate,
  queryDeletedAccountsCountAggregatedByDate,
  queryActiveAccountsList,
  queryActiveAccountsCountAggregatedByDate,
  queryActiveAccountsCountAggregatedByWeek,
  queryNewContractsCountAggregatedByDate,
  queryUniqueDeployedContractsCountAggregatedByDate,
  queryActiveContractsCountAggregatedByDate,
  queryActiveContractsList,
  healthCheck,
} from "../database/queries";
import * as nearApi from "../utils/near";
import { queryEpochData } from "../providers/network";
import { wait } from "../common";
import { GlobalState } from "../global-state";
import { RegularCheckFn } from "./types";
import {
  getPublishIfChanged,
  publishOnChange,
  updateRegularlyFetchedMap,
} from "./utils";
import { SECOND, MINUTE } from "../utils/time";

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

export const onlineNodesCountCheck: RegularCheckFn = {
  description: "online nodes count check",
  fn: publishOnChange(
    "onlineNodesCount",
    queryOnlineNodesCount,
    config.intervals.checkOnlineNodesCount
  ),
};

export const genesisProtocolInfoFetch: RegularCheckFn = {
  description: "genesis protocol info",
  fn: async (publish, context) => {
    const [genesisProtocolConfig, genesisAccountCount] = await Promise.all([
      nearApi.sendJsonRpc("EXPERIMENTAL_genesis_config", { finality: "final" }),
      queryGenesisAccountCount(),
    ]);
    context.state.genesis = {
      minStakeRatio: genesisProtocolConfig.minimum_stake_ratio,
      accountCount: Number(genesisAccountCount.count),
    };
    publish("genesisConfig", {
      height: genesisProtocolConfig.genesis_height,
      timestamp: new Date(genesisProtocolConfig.genesis_time).valueOf(),
      protocolVersion: genesisProtocolConfig.protocol_version,
      totalSupply: genesisProtocolConfig.total_supply,
      accountCount: Number(genesisAccountCount.count),
    });
    return Infinity;
  },
};

export const transactionsHistoryCheck: RegularCheckFn = {
  description: "transactionsHistoryCheck",
  fn: publishOnChange(
    "transactionsHistory",
    queryTransactionsHistory,
    config.intervals.checkTransactionHistory
  ),
};

export const tokensSupplyCheck: RegularCheckFn = {
  description: "circulatingSupplyCheck",
  fn: publishOnChange(
    "tokensSupply",
    queryTokensSupply,
    config.intervals.checkTokensSupply
  ),
};

export const gasUsedHistoryCheck: RegularCheckFn = {
  description: "gasUsedHistoryCheck",
  fn: publishOnChange(
    "gasUsedHistory",
    queryGasUsedAggregatedByDate,
    config.intervals.checkAggregatedStats
  ),
};

export const contractsHistoryCheck: RegularCheckFn = {
  description: "contractsHistory",
  fn: publishOnChange(
    "contractsHistory",
    async () => {
      const [newContracts, uniqueContracts] = await Promise.all([
        queryNewContractsCountAggregatedByDate(),
        queryUniqueDeployedContractsCountAggregatedByDate(),
      ]);
      return { newContracts, uniqueContracts };
    },
    config.intervals.checkAggregatedStats
  ),
};

export const activeContractsHistoryCheck: RegularCheckFn = {
  description: "activeContractsHistory",
  fn: publishOnChange(
    "activeContractsHistory",
    queryActiveContractsCountAggregatedByDate,
    config.intervals.checkAggregatedStats
  ),
};

export const activeContractsListCheck: RegularCheckFn = {
  description: "activeContractsList",
  fn: publishOnChange(
    "activeContractsList",
    queryActiveContractsList,
    config.intervals.checkAggregatedStats
  ),
};

export const accountsHistoryCheck: RegularCheckFn = {
  description: "accountsHistoryCheck",
  fn: async (publish, context) => {
    const publishIfChanged = getPublishIfChanged(publish, context);
    if (!context.state.genesis) {
      return 10 * SECOND;
    }
    const [newAccounts, deletedAccounts] = await Promise.all([
      queryNewAccountsCountAggregatedByDate(),
      queryDeletedAccountsCountAggregatedByDate(),
    ]);
    const newAccountMap = new Map<number, number>();
    for (let i = 0; i < newAccounts.length; i++) {
      const [timestamp, accountsCount] = newAccounts[i];
      newAccountMap.set(timestamp, accountsCount);
    }

    const deletedAccountMap = new Map<number, number>();
    for (let i = 0; i < deletedAccounts.length; i++) {
      const [timestamp, accountsCount] = deletedAccounts[i];
      deletedAccountMap.set(timestamp, accountsCount);
    }

    const allTimestamps = [
      ...new Set([
        ...newAccounts.map(([timestamp]) => timestamp),
        ...deletedAccounts.map(([timestamp]) => timestamp),
      ]),
    ].sort();

    const liveAccounts = allTimestamps
      .reduce<[number, number][]>(
        (acc, timestamp) => {
          const newAccountsCount = newAccountMap.get(timestamp) ?? 0;
          const deletedAccountsCount = deletedAccountMap.get(timestamp) ?? 0;
          const prevAccountsCount = acc[acc.length - 1][1];
          return [
            ...acc,
            [
              timestamp,
              prevAccountsCount + newAccountsCount - deletedAccountsCount,
            ],
          ];
        },
        [[0, context.state.genesis.accountCount]]
      )
      .slice(1);
    publishIfChanged("accountsHistory", { newAccounts, liveAccounts });
    return config.intervals.checkAggregatedStats;
  },
};

export const activeAccountsHistoryCheck: RegularCheckFn = {
  description: "activeAccountsHistory",
  fn: publishOnChange(
    "activeAccountsHistory",
    async () => {
      const [byDay, byWeek] = await Promise.all([
        queryActiveAccountsCountAggregatedByDate(),
        queryActiveAccountsCountAggregatedByWeek(),
      ]);
      return { byDay, byWeek };
    },
    config.intervals.checkAggregatedStats
  ),
};

export const activeAccountsListCheck: RegularCheckFn = {
  description: "activeAccountsListCheck",
  fn: publishOnChange(
    "activeAccountsList",
    queryActiveAccountsList,
    config.intervals.checkAggregatedStats
  ),
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
      nearApi
        .callViewMethod<string>(id, "get_total_staked_balance", {})
        .catch(() => undefined),
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
      const account = await nearApi.sendJsonRpcQuery("view_account", {
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
        fee: await nearApi
          .callViewMethod<ValidatorPoolInfo["fee"]>(
            id,
            "get_reward_fee_fraction",
            {}
          )
          .catch(() => null),
        delegatorsCount: await nearApi
          .callViewMethod<ValidatorPoolInfo["delegatorsCount"]>(
            id,
            "get_number_of_accounts",
            {}
          )
          .catch(() => null),
      };
    },
    config.intervals.checkStakingPoolInfo,
    config.timeouts.timeoutStakingPoolsInfo
  );
};

export const networkInfoCheck: RegularCheckFn = {
  description: "publish network info",
  fn: async (publish, context) => {
    const epochData = await queryEpochData(context);
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
    publish(
      "validators",
      epochData.validators.map((validator) => ({
        ...validator,
        description: context.state.stakingPoolsDescriptions.get(
          validator.accountId
        ),
        poolInfo: context.state.stakingPoolInfos.valueMap.get(
          validator.accountId
        ),
        contractStake:
          context.state.stakingPoolStakeProposalsFromContract.valueMap.get(
            validator.accountId
          ),
        telemetry: telemetryInfo.get(validator.accountId),
      }))
    );
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
      const metadataInfo = await nearApi.callViewMethod<
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

const RPC_BLOCK_AFFORDABLE_LAG = 5 * MINUTE;
export const rpcStatusCheck: RegularCheckFn = {
  description: "rpc status check",
  fn: async (publish, context) => {
    try {
      const status = await nearApi.sendJsonRpc("status", []);
      const latestBlockTime = new Date(status.sync_info.latest_block_time);
      const now = Date.now();
      if (latestBlockTime.valueOf() + RPC_BLOCK_AFFORDABLE_LAG < now) {
        context.state.rpcStatus = {
          ok: false,
          message: `RPC doesn't report any new blocks for ${moment
            .duration(RPC_BLOCK_AFFORDABLE_LAG)
            .humanize()}`,
          timestamp: now,
        };
      } else {
        context.state.rpcStatus = {
          ok: true,
          timestamp: now,
        };
      }
    } catch (e) {
      context.state.rpcStatus = {
        ok: false,
        message: "RPC is having troubles",
        timestamp: Date.now(),
      };
    } finally {
      publish("rpcStatus", context.state.rpcStatus);
      return config.intervals.checkRpcStatus;
    }
  },
};

const INDEXER_BLOCK_AFFORDABLE_LAG = 5 * MINUTE;
export const indexerStatusCheck: RegularCheckFn = {
  description: "indexer status check",
  fn: async (publish, context) => {
    try {
      await healthCheck();
      const now = Date.now();
      const latestBlock = context.subscriptionsCache.latestBlock;
      if (!latestBlock) {
        context.state.indexerStatus = {
          ok: true,
          timestamp: now,
        };
      } else {
        if (latestBlock.timestamp + INDEXER_BLOCK_AFFORDABLE_LAG < now) {
          context.state.indexerStatus = {
            ok: false,
            message: `Indexer doesn't report any new blocks for ${moment
              .duration(INDEXER_BLOCK_AFFORDABLE_LAG)
              .humanize()}`,
            timestamp: now,
          };
        } else {
          context.state.indexerStatus = {
            ok: true,
            timestamp: now,
          };
        }
      }
    } catch (e) {
      context.state.rpcStatus = {
        ok: false,
        message: "Indexer is having troubles",
        timestamp: Date.now(),
      };
    } finally {
      publish("indexerStatus", context.state.indexerStatus);
      return config.intervals.checkIndexerStatus;
    }
  },
};
