import { formatDuration, intervalToDuration } from "date-fns";
import { sql } from "kysely";

import { config } from "@/backend/config";
import { Context } from "@/backend/context";
import { RegularCheckFn } from "@/backend/cron/types";
import {
  getPublishIfChanged,
  publishOnChange,
  updateRegularlyFetchedMap,
} from "@/backend/cron/utils";
import {
  analyticsDatabase,
  indexerDatabase,
  telemetryDatabase,
} from "@/backend/database/databases";
import { count, div, sum } from "@/backend/database/utils";
import { GlobalState } from "@/backend/global-state";
import {
  ValidatorEpochData,
  ValidatorPoolInfo,
  ValidatorTelemetry,
} from "@/backend/router/types";
import {
  nanosecondsToMilliseconds,
  nearNomination,
  teraGasNomination,
} from "@/backend/utils/bigint";
import * as nearApi from "@/backend/utils/near";
import { SECOND, MINUTE } from "@/backend/utils/time";
import * as RPC from "@/common/types/rpc";
import { EMPTY_CODE_HASH } from "@/common/utils/constants";
import { wait } from "@/common/utils/promise";

export const latestBlockCheck: RegularCheckFn = {
  description: "publish finality status",
  fn: publishOnChange(
    "latestBlock",
    async () => {
      const latestBlockHeightSelection = await indexerDatabase
        .selectFrom("blocks")
        .select([
          "block_height as blockHeight",
          (eb) => div(eb, "block_timestamp", 1000 * 1000, "blockTimestampMs"),
        ])
        .orderBy("block_height", "desc")
        .limit(1)
        .executeTakeFirstOrThrow();
      return {
        height: Number(latestBlockHeightSelection.blockHeight),
        timestamp: Number(latestBlockHeightSelection.blockTimestampMs),
      };
    },
    config.intervals.checkLatestBlock
  ),
};

export const latestGasPriceCheck: RegularCheckFn = {
  description: "latest gas price check from Indexer",
  fn: publishOnChange(
    "latestGasPrice",
    async () => {
      const latestGasPriceSelection = await indexerDatabase
        .selectFrom("blocks")
        .select("gas_price")
        .orderBy("block_height", "desc")
        .limit(1)
        .executeTakeFirstOrThrow();
      return latestGasPriceSelection.gas_price;
    },
    config.intervals.checkLatestGasPrice
  ),
};

export const blockProductionSpeedCheck: RegularCheckFn = {
  description: "block production speed check from Indexer",
  fn: publishOnChange(
    "blockProductionSpeed",
    async () => {
      const lastestBlockTimestampSelection = await indexerDatabase
        .selectFrom("blocks")
        .select("block_timestamp")
        .orderBy("block_timestamp", "desc")
        .limit(1)
        .executeTakeFirst();
      if (!lastestBlockTimestampSelection) {
        return 0;
      }
      const { block_timestamp: latestBlockTimestamp } =
        lastestBlockTimestampSelection;
      const latestBlockTimestampBI = BigInt(latestBlockTimestamp);
      const currentUnixTimeBI = BigInt(Math.floor(new Date().getTime() / 1000));
      const latestBlockEpochTimeBI = latestBlockTimestampBI / 1000000000n;
      // If the latest block is older than 1 minute from now, we report 0
      if (currentUnixTimeBI - latestBlockEpochTimeBI > 60) {
        return 0;
      }

      const selection = await indexerDatabase
        .selectFrom("blocks")
        .select((eb) =>
          count(eb, "block_hash").as("blocks_count_60_seconds_before")
        )
        .where(
          "block_timestamp",
          ">",
          sql`cast(
            ${Number(latestBlockEpochTimeBI)} - 60 as bigint
          ) * 1000 * 1000 * 1000`
        )
        .executeTakeFirstOrThrow();
      return parseInt(selection.blocks_count_60_seconds_before, 10) / 60;
    },
    config.intervals.checkBlockProductionSpeed
  ),
};

export const recentTransactionsCountCheck: RegularCheckFn = {
  description: "recent transactions check from Indexer",
  fn: publishOnChange(
    "recentTransactionsCount",
    async () => {
      const selection = await indexerDatabase
        .selectFrom("transactions")
        .select((eb) => count(eb, "transaction_hash").as("total"))
        .where(
          "block_timestamp",
          ">",
          sql`cast(
            extract(
              epoch from now() - '1 day'::interval
            ) as bigint
          ) * 1000 * 1000 * 1000`
        )
        .executeTakeFirstOrThrow();

      return parseInt(selection.total, 10);
    },
    config.intervals.checkRecentTransactions
  ),
};

export const onlineNodesCountCheck: RegularCheckFn = {
  description: "online nodes count check",
  fn: publishOnChange(
    "onlineNodesCount",
    async () => {
      const selection = await telemetryDatabase
        .selectFrom("nodes")
        .select((eb) => count(eb, "node_id").as("onlineNodesCount"))
        .where("last_seen", ">", sql`now() - '60 seconds'::interval`)
        .executeTakeFirstOrThrow();
      return parseInt(selection.onlineNodesCount, 10);
    },
    config.intervals.checkOnlineNodesCount
  ),
};

export const genesisProtocolInfoFetch: RegularCheckFn = {
  description: "genesis protocol info",
  fn: publishOnChange(
    "genesisConfig",
    async () => {
      const [genesisProtocolConfig, genesisAccountCount] = await Promise.all([
        nearApi.sendJsonRpc("EXPERIMENTAL_genesis_config", {
          finality: "final",
        }),
        indexerDatabase
          .selectFrom("accounts")
          .select((eb) => count(eb, "id").as("count"))
          .where("created_by_receipt_id", "is", null)
          .executeTakeFirstOrThrow(),
      ]);
      return {
        height: genesisProtocolConfig.genesis_height,
        timestamp: new Date(genesisProtocolConfig.genesis_time).valueOf(),
        protocolVersion: genesisProtocolConfig.protocol_version,
        totalSupply: genesisProtocolConfig.total_supply,
        accountCount: Number(genesisAccountCount.count),
        minStakeRatio: genesisProtocolConfig.minimum_stake_ratio,
      };
    },
    Infinity
  ),
};

export const transactionsHistoryCheck: RegularCheckFn = {
  description: "transactionsHistoryCheck",
  fn: publishOnChange(
    "transactionsHistory",
    async () => {
      if (!analyticsDatabase) {
        return [];
      }
      const selection = await analyticsDatabase
        .selectFrom("daily_transactions_count")
        .select(["collected_for_day as date", "transactions_count as count"])
        .orderBy("date")
        .execute();
      return selection.map<[number, number]>((row) => [
        row.date.valueOf(),
        Number(row.count),
      ]);
    },
    config.intervals.checkTransactionHistory
  ),
};

export const tokensSupplyCheck: RegularCheckFn = {
  description: "circulatingSupplyCheck",
  fn: publishOnChange(
    "tokensSupply",
    async () => {
      const selection = await indexerDatabase
        .selectFrom("aggregated__circulating_supply")
        .select([
          sql<Date>`date_trunc(
            'day',
            to_timestamp(
              div(
                computed_at_block_timestamp, 1000 * 1000 * 1000
              )
            )
          )`.as("date"),
          "circulating_tokens_supply as circulatingSupply",
          "total_tokens_supply as totalSupply",
        ])
        .orderBy("date")
        .execute();
      return selection.map<[number, number, number]>(
        ({ date, totalSupply, circulatingSupply }) => [
          date.valueOf(),
          Number(BigInt(totalSupply) / nearNomination),
          Number(BigInt(circulatingSupply) / nearNomination),
        ]
      );
    },
    config.intervals.checkTokensSupply
  ),
};

export const gasUsedHistoryCheck: RegularCheckFn = {
  description: "gasUsedHistoryCheck",
  fn: publishOnChange(
    "gasUsedHistory",
    async () => {
      if (!analyticsDatabase) {
        return [];
      }
      const selection = await analyticsDatabase
        .selectFrom("daily_gas_used")
        .select(["collected_for_day as date", "gas_used as gasUsed"])
        .orderBy("date")
        .execute();
      return selection.map<[number, number]>(({ date, gasUsed }) => [
        date.valueOf(),
        Number(BigInt(gasUsed) / teraGasNomination),
      ]);
    },
    config.intervals.checkAggregatedStats
  ),
};

export const contractsHistoryCheck: RegularCheckFn = {
  description: "contractsHistory",
  fn: publishOnChange(
    "contractsHistory",
    async () => {
      if (!analyticsDatabase) {
        return { newContracts: [], uniqueContracts: [] };
      }
      const [newContracts, uniqueContracts] = await Promise.all([
        (
          await analyticsDatabase
            .selectFrom("daily_new_contracts_count")
            .select([
              "collected_for_day as date",
              "new_contracts_count as contractsCount",
            ])
            .orderBy("date")
            .execute()
        ).map<[number, number]>(({ date, contractsCount }) => [
          date.valueOf(),
          contractsCount,
        ]),
        (
          await analyticsDatabase
            .selectFrom("daily_new_unique_contracts_count")
            .select([
              "collected_for_day as date",
              "new_unique_contracts_count as contractsCount",
            ])
            .orderBy("date")
            .execute()
        ).map<[number, number]>(({ date, contractsCount }) => [
          date.valueOf(),
          contractsCount,
        ]),
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
    async () => {
      if (!analyticsDatabase) {
        return [];
      }
      const selection = await analyticsDatabase
        .selectFrom("daily_active_contracts_count")
        .select([
          "collected_for_day as date",
          "active_contracts_count as contractsCount",
        ])
        .orderBy("date")
        .execute();

      return selection.map<[number, number]>(({ date, contractsCount }) => [
        date.valueOf(),
        contractsCount,
      ]);
    },
    config.intervals.checkAggregatedStats
  ),
};

export const activeContractsListCheck: RegularCheckFn = {
  description: "activeContractsList",
  fn: publishOnChange(
    "activeContractsList",
    async () => {
      if (!analyticsDatabase) {
        return [];
      }
      const selection = await analyticsDatabase
        .selectFrom("daily_receipts_per_contract_count")
        .select([
          "contract_id as accountId",
          (eb) => sum(eb, "receipts_count").as("receiptsCount"),
        ])
        .where(
          "collected_for_day",
          ">=",
          sql`date_trunc(
            'day', now() - '2 week'::interval
          )`
        )
        .groupBy("contract_id")
        .orderBy("receiptsCount", "desc")
        .limit(10)
        .execute();

      return selection.map<[string, number]>(({ accountId, receiptsCount }) => [
        accountId,
        Number(receiptsCount || 0),
      ]);
    },
    config.intervals.checkAggregatedStats
  ),
};

export const accountsHistoryCheck: RegularCheckFn = {
  description: "accountsHistoryCheck",
  fn: async (publish, context) => {
    if (!analyticsDatabase) {
      return Infinity;
    }
    const { genesisConfig } = context.subscriptionsCache;
    if (!genesisConfig) {
      return 3 * SECOND;
    }
    const publishIfChanged = getPublishIfChanged(publish, context);
    const [newAccounts, deletedAccounts] = await Promise.all([
      (
        await analyticsDatabase
          .selectFrom("daily_new_accounts_count")
          .select([
            "collected_for_day as date",
            "new_accounts_count as accountsCount",
          ])
          .orderBy("date")
          .execute()
      ).map<[number, number]>(({ date, accountsCount }) => [
        date.valueOf(),
        accountsCount,
      ]),
      (
        await analyticsDatabase
          .selectFrom("daily_deleted_accounts_count")
          .select([
            "collected_for_day as date",
            "deleted_accounts_count as accountsCount",
          ])
          .orderBy("date")
          .execute()
      ).map<[number, number]>(({ date, accountsCount }) => [
        date.valueOf(),
        accountsCount,
      ]),
    ]);
    const newAccountMap = new Map<number, number>();
    for (let i = 0; i < newAccounts.length; i += 1) {
      const [timestamp, accountsCount] = newAccounts[i];
      newAccountMap.set(timestamp, accountsCount);
    }

    const deletedAccountMap = new Map<number, number>();
    for (let i = 0; i < deletedAccounts.length; i += 1) {
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
        [[0, genesisConfig.accountCount]]
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
      if (!analyticsDatabase) {
        return { byDay: [], byWeek: [] };
      }
      const [byDay, byWeek] = await Promise.all([
        (
          await analyticsDatabase
            .selectFrom("daily_active_accounts_count")
            .select([
              "collected_for_day as date",
              "active_accounts_count as accountsCount",
            ])
            .orderBy("date")
            .execute()
        ).map<[number, number]>(({ date, accountsCount }) => [
          date.valueOf(),
          accountsCount,
        ]),
        (
          await analyticsDatabase
            .selectFrom("weekly_active_accounts_count")
            .select([
              "collected_for_week as date",
              "active_accounts_count as accountsCount",
            ])
            .orderBy("date")
            .execute()
        ).map<[number, number]>(({ date, accountsCount }) => [
          date.valueOf(),
          accountsCount,
        ]),
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
    async () => {
      if (!analyticsDatabase) {
        return [];
      }
      const selection = await analyticsDatabase
        .selectFrom("daily_outgoing_transactions_per_account_count")
        .select([
          "account_id as accountId",
          (eb) =>
            sum(eb, "outgoing_transactions_count").as("transactionsCount"),
        ])
        .where(
          "collected_for_day",
          ">=",
          sql`date_trunc(
            'day', now() - '2 week'::interval
          )`
        )
        .groupBy("account_id")
        .orderBy("transactionsCount", "desc")
        .limit(10)
        .execute();
      return selection.map<[string, number]>(
        ({ accountId, transactionsCount }) => [
          accountId,
          Number(transactionsCount || 0),
        ]
      );
    },
    config.intervals.checkAggregatedStats
  ),
};

const getValidatorsTimeout = (context: Context) => {
  const { latestBlock, epochStartBlock, protocolConfig } =
    context.subscriptionsCache;
  if (!latestBlock || !epochStartBlock || !protocolConfig) {
    return 3 * SECOND;
  }
  const epochProgress =
    (latestBlock.height - epochStartBlock.height) / protocolConfig.epochLength;
  const timeRemaining =
    (latestBlock.timestamp - epochStartBlock.timestamp) * (1 - epochProgress);
  return Math.max(SECOND, timeRemaining / 2);
};

const getValidators = async (context: Context) => {
  if (context.state.validatorsPromise) {
    return context.state.validatorsPromise;
  }
  const validatorsPromise = nearApi.sendJsonRpc("validators", [null]);
  context.state.validatorsPromise = validatorsPromise;
  setTimeout(() => {
    context.state.validatorsPromise = undefined;
  }, getValidatorsTimeout(context));
  return validatorsPromise;
};

const updateStakingPoolStakeProposalsFromContractMap = async (
  validators: ValidatorEpochData[],
  state: GlobalState
): Promise<void> =>
  updateRegularlyFetchedMap(
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

const updatePoolInfoMap = async (
  validators: ValidatorEpochData[],
  state: GlobalState
): Promise<void> =>
  updateRegularlyFetchedMap(
    validators.map((validator) => validator.accountId),
    state.stakingPoolInfos,
    async (id) => {
      const account = await nearApi.sendJsonRpcQuery("view_account", {
        account_id: id,
        finality: "final",
      });

      if (account.code_hash === EMPTY_CODE_HASH) {
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

export const protocolConfigCheck: RegularCheckFn = {
  description: "protocol config check",
  fn: publishOnChange(
    "protocolConfig",
    async () => {
      const protocolConfig = await nearApi.sendJsonRpc(
        "EXPERIMENTAL_protocol_config",
        { finality: "final" }
      );
      return {
        version: protocolConfig.protocol_version,
        epochLength: protocolConfig.epoch_length,
        maxNumberOfSeats:
          protocolConfig.num_block_producer_seats +
          protocolConfig.avg_hidden_validator_seats_per_shard.reduce(
            (seats, seat) => seats + seat,
            0
          ),
      };
    },
    config.intervals.checkProtocolInfo
  ),
};

const mapValidators = (
  epochStatus: RPC.EpochValidatorInfo,
  poolIds: string[]
): ValidatorEpochData[] => {
  const validatorsMap: Map<string, ValidatorEpochData> = new Map();

  for (const currentValidator of epochStatus.current_validators) {
    validatorsMap.set(currentValidator.account_id, {
      accountId: currentValidator.account_id,
      publicKey: currentValidator.public_key,
      currentEpoch: {
        stake: currentValidator.stake,
        progress: {
          blocks: {
            produced: currentValidator.num_produced_blocks,
            total: currentValidator.num_expected_blocks,
          },
          chunks: {
            produced: currentValidator.num_produced_chunks,
            total: currentValidator.num_expected_chunks,
          },
        },
      },
    });
  }

  for (const nextValidator of epochStatus.next_validators) {
    const validator = validatorsMap.get(nextValidator.account_id) || {
      accountId: nextValidator.account_id,
      publicKey: nextValidator.public_key,
    };
    validator.nextEpoch = {
      stake: nextValidator.stake,
    };
    validatorsMap.set(nextValidator.account_id, validator);
  }

  for (const nextProposal of epochStatus.current_proposals) {
    const validator = validatorsMap.get(nextProposal.account_id) || {
      accountId: nextProposal.account_id,
      publicKey: nextProposal.public_key,
    };
    validator.afterNextEpoch = {
      stake: nextProposal.stake,
    };
    validatorsMap.set(nextProposal.account_id, validator);
  }

  for (const accountId of poolIds) {
    const validator = validatorsMap.get(accountId) || {
      accountId,
    };
    validatorsMap.set(accountId, validator);
  }

  return [...validatorsMap.values()];
};

export const epochStartBlockCheck: RegularCheckFn = {
  description: "current epoch start block info",
  fn: async (publish, context) => {
    const validators = await getValidators(context);
    const epochStartBlock = await nearApi.sendJsonRpc("block", {
      block_id: validators.epoch_start_height,
    });
    const publishIfChanged = getPublishIfChanged(publish, context);
    publishIfChanged("epochStartBlock", {
      height: epochStartBlock.header.height,
      timestamp: nanosecondsToMilliseconds(
        BigInt(epochStartBlock.header.timestamp)
      ),
      totalSupply: epochStartBlock.header.total_supply,
    });
    return getValidatorsTimeout(context);
  },
};

export const epochStatsCheck: RegularCheckFn = {
  description: "epoch stats info",
  fn: async (publish, context) => {
    const { protocolConfig, genesisConfig } = context.subscriptionsCache;
    if (!protocolConfig || !genesisConfig) {
      // Protocol config or genesis config are not fetched yet, probably will be available in a few seconds
      return 3 * SECOND;
    }
    const validators = await getValidators(context);
    publish("epochStats", {
      seatPrice: nearApi.validators
        .findSeatPrice(
          validators.current_validators,
          protocolConfig.maxNumberOfSeats,
          genesisConfig.minStakeRatio,
          protocolConfig.version
        )
        .toString(),
    });
    return getValidatorsTimeout(context);
  },
};

export const validatorsTelemetryCheck: RegularCheckFn = {
  description: "publish validators telemetry",
  fn: async (publish, context) => {
    const publishIfChanged = getPublishIfChanged(publish, context);
    const validators = await getValidators(context);
    const accountIds = [
      ...validators.current_validators.map(({ account_id }) => account_id),
      ...validators.next_validators.map(({ account_id }) => account_id),
      ...validators.current_proposals.map(({ account_id }) => account_id),
      ...context.state.poolIds,
    ];
    const nodesInfo = await telemetryDatabase
      .selectFrom("nodes")
      .select([
        "ip_address",
        "account_id",
        "node_id",
        "last_seen",
        "last_height",
        "status",
        "agent_name",
        "agent_version",
        "agent_build",
        "latitude",
        "longitude",
        "city",
      ])
      .where("account_id", "in", accountIds)
      .orderBy("last_seen")
      .execute();
    publishIfChanged(
      "validatorTelemetry",
      nodesInfo.reduce<Partial<Record<string, ValidatorTelemetry>>>(
        (acc, nodeInfo) => {
          acc[nodeInfo.account_id] = {
            ipAddress: nodeInfo.ip_address,
            nodeId: nodeInfo.node_id,
            lastSeen: nodeInfo.last_seen.valueOf(),
            lastHeight: parseInt(nodeInfo.last_height, 10),
            status: nodeInfo.status,
            agentName: nodeInfo.agent_name,
            agentVersion: nodeInfo.agent_version,
            agentBuild: nodeInfo.agent_build,
            latitude: nodeInfo.latitude,
            longitude: nodeInfo.longitude,
            city: nodeInfo.city,
          };
          return acc;
        },
        {}
      )
    );
    return config.intervals.checkValidatorsTelemetry;
  },
};

export const validatorsCheck: RegularCheckFn = {
  description: "validators info",
  fn: async (publish, context) => {
    const validators = await getValidators(context);
    publish("currentValidatorsCount", validators.current_validators.length);
    const mappedValidators = mapValidators(validators, context.state.poolIds);
    await Promise.all([
      Promise.race([
        updateStakingPoolStakeProposalsFromContractMap(
          mappedValidators,
          context.state
        ),
        wait(config.timeouts.timeoutFetchValidatorsBailout),
      ]),
      Promise.race([
        updatePoolInfoMap(mappedValidators, context.state),
        wait(config.timeouts.timeoutFetchValidatorsBailout),
      ]),
    ]);
    publish(
      "validators",
      mappedValidators.map((validator) => ({
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
      }))
    );
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
    let currentIndex = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      // eslint-disable-next-line no-await-in-loop
      const metadataInfo = await nearApi.callViewMethod<
        Record<string, PoolMetadataAccountInfo>
      >("pool-details.near", "get_all_fields", {
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
      currentIndex += VALIDATOR_DESCRIPTION_QUERY_AMOUNT;
    }
  },
  shouldSkip: () => config.networkName !== "mainnet",
};

export const poolIdsCheck: RegularCheckFn = {
  description: "pool ids check",
  fn: async (_, context) => {
    const selection = await indexerDatabase
      .selectFrom("accounts")
      .select("account_id as accountId")
      .where(
        "account_id",
        "like",
        `%${config.accountIdSuffix.stakingPool[config.networkName]}`
      )
      .execute();
    context.state.poolIds = selection.map(({ accountId }) => accountId);
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
          message: `RPC doesn't report any new blocks for ${formatDuration(
            intervalToDuration({
              start: now - RPC_BLOCK_AFFORDABLE_LAG,
              end: now,
            })
          )}`,
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
      await sql`select 1`.execute(indexerDatabase);
      const now = Date.now();
      const { latestBlock } = context.subscriptionsCache;
      if (!latestBlock) {
        context.state.indexerStatus = {
          ok: true,
          timestamp: now,
        };
      } else if (latestBlock.timestamp + INDEXER_BLOCK_AFFORDABLE_LAG < now) {
        context.state.indexerStatus = {
          ok: false,
          message: `Indexer doesn't report any new blocks for ${formatDuration(
            intervalToDuration({
              start: now - INDEXER_BLOCK_AFFORDABLE_LAG,
              end: now,
            })
          )}`,
          timestamp: now,
        };
      } else {
        context.state.indexerStatus = {
          ok: true,
          timestamp: now,
        };
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
