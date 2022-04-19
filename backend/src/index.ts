import BN from "bn.js";

import {
  regularPublishFinalityStatusInterval,
  regularQueryStatsInterval,
  regularPublishNetworkInfoInterval,
  regularFetchStakingPoolsInfoInterval,
  regularStatsInterval,
  wampNearNetworkName,
  regularFetchStakingPoolsMetadataInfoInterval,
  regularPublishTransactionCountForTwoWeeksInterval,
} from "./config";

import {
  queryFinalBlock,
  queryEpochStats,
  callViewMethod,
  CurrentNode,
  sendJsonRpcQuery,
} from "./near";

import { setupWamp, wampPublish } from "./wamp";

import {
  extendWithTelemetryInfo,
  queryOnlineNodes,
  queryDashboardBlocksStats,
  queryTransactionsCountHistoryForTwoWeeks,
  queryRecentTransactionsCount,
  OnlineNode,
  StakingNodeWithTelemetryInfo,
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
import { StakingPoolInfo, StakingStatus } from "./client-types";
import { formatDate, trimError } from "./utils";
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

const nonValidatingNodeStatuses = ["on-hold", "newcomer", "idle"];

type StakingNodeInfo = StakingNodeWithTelemetryInfo & {
  stakingPoolInfo?: StakingPoolInfo;
  currentStake?: string;
  poolDetails?: PoolMetadataAccountInfo;
  stakingStatus?: StakingStatus;
};

let transactionsCountHistoryForTwoWeeks: { date: Date; total: number }[] = [];
let currentValidators: CurrentNode[] = [];
let stakingNodes: StakingNodeInfo[] = [];
let stakingPoolsInfo = new Map<string, StakingPoolInfo>();
let currentStakeInfo = new Map<string, string | undefined>();
let stakingPoolsMetadataInfo = new Map<string, PoolMetadataAccountInfo>();

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
      const epochStats = await queryEpochStats();

      currentValidators = epochStats.currentValidators;

      const onlineNodes = await queryOnlineNodes();

      const originalStakingNodes = await extendWithTelemetryInfo([
        ...epochStats.stakingNodes.values(),
      ]);

      const onlineValidatingNodes = originalStakingNodes
        .filter((i) => "stakingStatus" in i && i.stakingStatus !== "proposal")
        .map((node) => node.nodeInfo)
        .filter((nodeInfo): nodeInfo is OnlineNode => Boolean(nodeInfo));

      stakingNodes = originalStakingNodes.map((validator) => {
        const stakingPoolInfo = stakingPoolsInfo.get(validator.account_id);
        if (!stakingPoolInfo) {
          return validator;
        }
        // '!validator.stakingStatus' occured at the first start
        // when we query all pool accounts from database.
        // Before this moment we'll have the validators with statuses
        // 'active', 'joining', 'leaving' and 'proposal'.
        // So here we set, check and regulary re-check is validators
        // still has those statuses
        const currentStake =
          "currentStake" in validator ? validator.currentStake : "0";
        let stakingStatus: StakingStatus | undefined =
          "stakingStatus" in validator ? validator.stakingStatus : undefined;

        if (
          !stakingStatus ||
          nonValidatingNodeStatuses.includes(stakingStatus)
        ) {
          if (new BN(currentStake).gt(new BN(epochStats.seatPrice))) {
            stakingStatus = "on-hold";
          } else if (
            new BN(currentStake).gte(
              new BN(epochStats.seatPrice).muln(20).divn(100)
            )
          ) {
            stakingStatus = "newcomer";
          } else if (
            new BN(currentStake).lt(
              new BN(epochStats.seatPrice).muln(20).divn(100)
            )
          ) {
            stakingStatus = "idle";
          }
        }
        return {
          ...validator,
          stakingPoolInfo,
          currentStake: currentStakeInfo.get(validator.account_id),
          poolDetails: stakingPoolsMetadataInfo.get(validator.account_id),
          stakingStatus,
        };
      });

      void wampPublish(
        "nodes",
        {
          onlineNodes,
          currentValidators,
          onlineValidatingNodes,
          stakingNodes,
        },
        getSession
      );
      void wampPublish(
        "network-stats",
        {
          currentValidatorsCount: currentValidators.length,
          onlineNodesCount: onlineNodes.length,
          epochLength: epochStats.epochLength,
          epochStartHeight: epochStats.epochStartHeight,
          epochProtocolVersion: epochStats.epochProtocolVersion,
          totalStake: epochStats.totalStake,
          seatPrice: epochStats.seatPrice,
          genesisTime: epochStats.genesisTime,
          genesisHeight: epochStats.genesisHeight,
        },
        getSession
      );
    } catch (error) {
      console.warn("Regular network info publishing crashed due to:", error);
    }
    setTimeout(regularPublishNetworkInfo, regularPublishNetworkInfoInterval);
  };
  setTimeout(regularPublishNetworkInfo, 0);

  // Periodic check of validators' metadata info (country, country_flag, etc.)
  // This query works only for 'mainnet'
  function startRegularFetchStakingPoolsMetadataInfo(): void {
    const regularFetchStakingPoolsMetadataInfo = async (): Promise<void> => {
      try {
        const queryRowsCount = 100;
        const fetchPoolsMetadataInfo = (
          counter = 0
        ): Promise<PoolMetadataInfo> => {
          return callViewMethod("name.near", "get_all_fields", {
            from_index: counter,
            limit: queryRowsCount,
          });
        };
        let metadataInfo = await fetchPoolsMetadataInfo();

        for (
          let i = 0;
          Object.keys(metadataInfo).length !== 0;
          i += queryRowsCount
        ) {
          metadataInfo = await fetchPoolsMetadataInfo(i);

          Object.keys(metadataInfo).map((account_id) => {
            stakingPoolsMetadataInfo.set(account_id, {
              ...metadataInfo[account_id],
            });
          });
        }
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

  // Periodic check of validators' staking pool fee and delegators count
  const regularFetchStakingPoolsInfo = async (): Promise<void> => {
    try {
      if (stakingNodes.length > 0) {
        for (let i = 0; i < stakingNodes.length; i++) {
          const {
            account_id,
            stakingStatus,
            currentStake: activeNodeStake,
          } = stakingNodes[i];

          try {
            let currentStake = activeNodeStake || undefined;
            const account = await sendJsonRpcQuery("view_account", {
              account_id: account_id,
              finality: "final",
            });

            // query and update 'currentStake' for 'on-hold', 'newcomer' and 'idle' nodes
            // because other nodes receive 'currentStake' from 'queryEpochStats()'
            if (
              !stakingStatus ||
              nonValidatingNodeStatuses.includes(stakingStatus)
            ) {
              currentStake = await callViewMethod<string>(
                account_id,
                "get_total_staked_balance",
                {}
              ).catch((_error) => {
                // for some accounts on 'testnet' we can't get 'currentStake'
                // because they looks like pool accounts but they are not so
                // that's why we catch this error to avoid unnecessary errors in console
                return undefined;
              });
            }
            currentStakeInfo.set(account_id, currentStake);

            // 'code_hash' === 11111111111111111111111111111111 is when the validator
            // does not have a staking-pool contract on it (common on testnet)
            if (account.code_hash === "11111111111111111111111111111111") {
              stakingPoolsInfo.set(account_id, {
                fee: null,
                delegatorsCount: null,
              });
            } else {
              const fee = await callViewMethod<{
                numerator: number;
                denominator: number;
              } | null>(account_id, "get_reward_fee_fraction", {}).catch(
                (_error) => {
                  // for some accounts on 'testnet' we can't get 'fee'
                  // because they looks like pool accounts but they are not so
                  // that's why we catch this error to avoid unnecessary errors in console
                  return null;
                }
              );
              const delegatorsCount = await callViewMethod<number>(
                account_id,
                "get_number_of_accounts",
                {}
              ).catch((_error) => {
                // for some accounts on 'testnet' we can't get 'delegatorsCount'
                // because they looks like pool accounts but they are not so
                // that's why we catch this error to avoid unnecessary errors in console
                return null;
              });
              stakingPoolsInfo.set(account_id, {
                fee,
                delegatorsCount,
              });
            }
          } catch (error) {
            console.warn(
              `Regular fetching staking pool ${account_id} info crashed due to:`,
              error
            );
          }
        }
      }
    } catch (error) {
      console.warn(
        "Regular fetching staking pools info crashed due to:",
        error
      );
    }
    setTimeout(
      regularFetchStakingPoolsInfo,
      regularFetchStakingPoolsInfoInterval
    );
  };
  setTimeout(regularFetchStakingPoolsInfo, 0);

  startDataSourceSpecificJobs(getSession);
  startStatsAggregation();

  if (wampNearNetworkName === "mainnet") {
    startRegularFetchStakingPoolsMetadataInfo();
  }
}

void main();
