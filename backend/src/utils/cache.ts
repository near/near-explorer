import { Context } from "@explorer/backend/context";
import { SubscriptionTopicType } from "@explorer/backend/router/types";

const topics: Record<SubscriptionTopicType, true> = {
  validators: true,
  validatorTelemetry: true,
  latestBlock: true,
  latestGasPrice: true,
  blockProductionSpeed: true,
  recentTransactionsCount: true,
  onlineNodesCount: true,
  genesisConfig: true,
  tokensSupply: true,
  transactionsHistory: true,
  gasUsedHistory: true,
  contractsHistory: true,
  activeContractsHistory: true,
  activeContractsList: true,
  accountsHistory: true,
  activeAccountsList: true,
  activeAccountsHistory: true,
  epochStats: true,
  epochStartBlock: true,
  rpcStatus: true,
  indexerStatus: true,
  currentValidatorsCount: true,
  protocolConfig: true,
};

export const getMissingSubscriptionCacheKeys = (context: Context) =>
  (Object.keys(topics) as SubscriptionTopicType[]).filter(
    (key) =>
      context.subscriptionsCache[key as SubscriptionTopicType] === undefined
  );
