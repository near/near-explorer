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
  currentValidatorsCount: number;
  onlineNodesCount: number;
  epochLength: number;
  epochStartHeight: number;
  epochProtocolVersion: number;
  totalStake: string;
  seatPrice: string;
  genesisTime: string;
  genesisHeight: number;
};

export type SubscriptionTopicTypes = {
  validators: {
    validators: ValidatorFullData[];
  };
  "chain-blocks-stats": {
    latestBlockHeight: string;
    latestGasPrice: string;
    recentBlockProductionSpeed: number;
  };
  "recent-transactions": {
    recentTransactionsCount: number;
  };
  "finality-status": {
    finalBlockTimestampNanosecond: string;
    finalBlockHeight: number;
  };
  "network-stats": NetworkStats;
};

export type SubscriptionTopicType = keyof SubscriptionTopicTypes;

export type SubMessage = ["sub", SubscriptionTopicType];
export type UnsubMessage = ["unsub", SubscriptionTopicType];
export type OutcomingMessage = SubMessage | UnsubMessage;

export type PublishMessage<T extends SubscriptionTopicType> = [
  T,
  SubscriptionTopicTypes[T]
];
export type IncomingMessage<
  T extends SubscriptionTopicType
> = PublishMessage<T>;
