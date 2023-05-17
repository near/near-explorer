import { HealthStatus } from "@explorer/backend/types";

export type ValidatorTelemetry = {
  ipAddress: string;
  nodeId: string;
  lastSeen: number;
  lastHeight: number;
  agentName: string;
  agentVersion: string;
  agentBuild: string;
  status: string;
  latitude: string | null;
  longitude: string | null;
  city: string | null;
};

export type ValidationProgress = {
  chunks: {
    produced: number;
    total: number;
  };
  blocks: {
    produced: number;
    total: number;
  };
};

export type ValidatorDescription = {
  country?: string;
  countryCode?: string;
  description?: string;
  discord?: string;
  email?: string;
  twitter?: string;
  url?: string;
};

export type ValidatorPoolInfo = {
  fee: { numerator: number; denominator: number } | null;
  delegatorsCount: number | null;
};

export type ValidatorEpochData = {
  accountId: string;
  publicKey?: string;

  currentEpoch?: {
    stake: string;
    progress: ValidationProgress;
  };
  nextEpoch?: {
    stake: string;
  };
  afterNextEpoch?: {
    stake: string;
  };
};

export type ValidatorFullData = ValidatorEpochData & {
  telemetry?: ValidatorTelemetry;
  poolInfo?: ValidatorPoolInfo;
  description?: ValidatorDescription;
  contractStake?: string;
};

export type NetworkStats = {
  epochLength: number;
  epochStartHeight: number;
  epochProtocolVersion: number;
  seatPrice?: string;
};

type TimestampDataSeries<T> = (T extends unknown[]
  ? [number, ...T]
  : [number, T])[];

export type SubscriptionTopicTypes = {
  validators: ValidatorFullData[];
  latestBlock: {
    height: number;
    timestamp: number;
  };
  latestGasPrice: string;
  blockProductionSpeed: number;
  recentTransactionsCount: number;
  onlineNodesCount: number;
  genesisConfig: {
    height: number;
    timestamp: number;
    protocolVersion: number;
    totalSupply: string;
    accountCount: number;
  };
  tokensSupply: TimestampDataSeries<
    [totalSupply: number, circulatingSupply: number]
  >;
  transactionsHistory: TimestampDataSeries<number>;
  gasUsedHistory: TimestampDataSeries<[teraGasUsed: number]>;
  contractsHistory: {
    newContracts: TimestampDataSeries<[contractsCount: number]>;
    uniqueContracts: TimestampDataSeries<[contractsCount: number]>;
  };
  activeContractsHistory: TimestampDataSeries<[contractsCount: number]>;
  activeContractsList: [accountId: string, receiptsCount: number][];
  accountsHistory: {
    newAccounts: TimestampDataSeries<[accountsCount: number]>;
    liveAccounts: TimestampDataSeries<[accountsCount: number]>;
  };
  activeAccountsList: [accountId: string, transactionsCount: number][];
  activeAccountsHistory: {
    byDay: TimestampDataSeries<[accountsCount: number]>;
    byWeek: TimestampDataSeries<[accountsCount: number]>;
  };
  "network-stats": NetworkStats;
  rpcStatus: HealthStatus;
  indexerStatus: HealthStatus;
  currentValidatorsCount: number;
};

export type SubscriptionTopicType = keyof SubscriptionTopicTypes;

export type SubscriptionEventMap = {
  [S in SubscriptionTopicType]: (
    nextOutput: SubscriptionTopicTypes[S],
    prevOutput?: SubscriptionTopicTypes[S]
  ) => void;
};
