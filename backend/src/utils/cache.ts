import { Context } from "@explorer/backend/context";
import { SubscriptionTopicType } from "@explorer/backend/router/types";

const topics: Record<SubscriptionTopicType, true> = {
  validators: true,
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
  "network-stats": true,
  rpcStatus: true,
  indexerStatus: true,
};

export const isSubscriptionCacheReady = (context: Context) =>
  Object.keys(topics).every(
    (key) =>
      context.subscriptionsCache[key as SubscriptionTopicType] !== undefined
  );
