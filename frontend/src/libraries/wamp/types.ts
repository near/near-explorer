import * as RPC from "../../../../backend/src/rpc-types";

export type TransactionCountHistory = {
  date: string;
  total: number;
};

export type NodeInfo = {
  ipAddress: string;
  accountId?: string;
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
export type StakingStatus =
  | "active"
  | "joining"
  | "leaving"
  | "proposal"
  | "idle"
  | "newcomer"
  | "on-hold";

export interface ValidationProgress {
  chunks: {
    produced: number;
    total: number;
  };
  blocks: {
    produced: number;
    total: number;
  };
}
export interface BaseValidationNodeInfo {
  account_id: string;
  is_slashed?: boolean;
  progress?: ValidationProgress;
  public_key?: string;
  currentStake?: string;
  proposedStake?: string;
  cumulativeStakeAmount?: string;
  stakingStatus?: StakingStatus;
  networkHolder?: boolean;
  shards?: number[];
  nodeInfo?: NodeInfo;
}

export interface PoolDetails {
  country?: string;
  country_code?: string;
  description?: string;
  discord?: string;
  email?: string;
  twitter?: string;
  url?: string;
}

export interface StakingPoolInfo {
  fee?: { numerator: number; denominator: number } | undefined;
  delegatorsCount?: number;
  poolDetails?: PoolDetails;
}

export type ValidationNodeInfo = BaseValidationNodeInfo & StakingPoolInfo;

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
  nodes: {
    onlineNodes: NodeInfo[];
    stakingNodes: ValidationNodeInfo[];
    currentValidators: unknown[];
    onlineValidatingNodes: NodeInfo[];
  };
  "chain-blocks-stats": {
    latestBlockHeight: string;
    latestGasPrice: string;
    recentBlockProductionSpeed: number;
  };
  "chain-transactions-stats": {
    transactionsCountHistoryForTwoWeeks: TransactionCountHistory[];
    recentTransactionsCount: number;
  };
  "finality-status": {
    finalBlockTimestampNanosecond: string;
    finalBlockHeight: number;
  };
  "network-stats": NetworkStats;
};

export type SubscriptionTopicType = keyof SubscriptionTopicTypes;

export type AccountBasicInfo = {
  accountId: string;
  createdByTransactionHash?: string;
  createdAtBlockTimestamp?: number;
  deletedByTransactionHash?: string;
  deletedAtBlockTimestamp?: number;
};

export type AccountDetails = {
  stakedBalance: string;
  nonStakedBalance: string;
  storageUsage?: string;
  minimumBalance: string;
  availableBalance: string;
  lockupAccountId?: string;
  lockupTotalBalance?: string;
  lockupLockedBalance?: string;
  lockupUnlockedBalance?: string;
  totalBalance: string;
};

export type AccountTransactionsCount = {
  inTransactionsCount: number;
  outTransactionsCount: number;
};

export type AccountPagination = {
  endTimestamp?: number;
  accountIndex: number;
};

export type PaginatedAccountBasicInfo = AccountBasicInfo & AccountPagination;

export type BlockBase = {
  hash: string;
  height: number;
  timestamp: number;
  prevHash: string;
  transactionsCount: number;
};

export type BlockInfo = BlockBase & {
  totalSupply: string;
  gasPrice: string;
  authorAccountId: string;
};

export type ContractInfo = {
  blockTimestamp: number;
  hash: string;
};

export type ReceiptExecutionStatus =
  | "Unknown"
  | "Failure"
  | "SuccessValue"
  | "SuccessReceiptId";

export type Receipt = {
  actions: Action[];
  blockTimestamp: number;
  receiptId: string;
  gasBurnt: string;
  receiverId: string;
  signerId: string;
  status?: ReceiptExecutionStatus;
  originatedFromTransactionHash?: string | null;
  tokensBurnt: string;
};

// from the search side 'originatedFromTransactionHash'
// can't be null
export type TransactionHashByReceiptId = {
  receiptId: string;
  originatedFromTransactionHash: string;
};

export type CirculatingSupplyStat = {
  date: string;
  circulatingTokensSupply: string;
  totalTokensSupply: string;
};

export type AccountTransactionAmount = {
  account: string;
  transactionsCount: string;
};

export type ContractReceiptsAmount = {
  contract: string;
  receiptsCount: string;
};

export type ContractsByDateAmount = {
  date: string;
  contractsCount: number;
};

export type AccountsByDateAmount = {
  date: string;
  accountsCount: number;
};

export type GasUsedByDateAmount = {
  date: string;
  gasUsed: string;
};

export type DepositByDateAmount = {
  date: string;
  depositAmount: string;
};

export type PartnerUserAmount = {
  account: string;
  userAmount: string;
};

export type TransactionsByDateAmount = {
  date: string;
  transactionsCount: string;
};

export type Action<
  A extends RPC.ActionView = RPC.ActionView
> = A extends Exclude<RPC.ActionView, "CreateAccount">
  ? {
      kind: keyof A;
      args: A[keyof A];
    }
  : {
      kind: "CreateAccount";
      args: {};
    };

export type ActionMapping = {
  CreateAccount: Action<"CreateAccount">;
  DeployContract: Action<RPC.DeployContractActionView>;
  FunctionCall: Action<RPC.FunctionCallActionView>;
  Transfer: Action<RPC.TransferActionView>;
  Stake: Action<RPC.StakeActionView>;
  AddKey: Action<RPC.AddKeyActionView>;
  DeleteKey: Action<RPC.DeleteKeyActionView>;
  DeleteAccount: Action<RPC.DeleteAccountActionView>;
};

export type TransactionBaseInfo = {
  hash: string;
  signerId: string;
  receiverId: string;
  blockHash: string;
  blockTimestamp: number;
  transactionIndex: number;
  actions: Action[];
};

export type TransactionPagination = {
  endTimestamp: number;
  transactionIndex: number;
};

// TODO: verify this type via zod or similar
export type TelemetryRequest = {
  ip_address: string;
  signature?: string;
  agent: {
    name: string;
    version: string;
    build: string;
  };
  chain: {
    node_id: string;
    account_id?: string;
    latest_block_height: number;
    num_peers: number;
    is_validator: boolean;
    latest_block_hash: string;
    status: string;
  };
};

export type ProcedureTypes = {
  "account-info": {
    args: [string];
    result: AccountBasicInfo | null;
  };
  // TODO: seems unused on client side, should we remove it?
  "account-activity": {
    args: [string];
    result: unknown;
  };
  "get-account-details": {
    args: [string];
    result: AccountDetails | null;
  };
  "account-transactions-count": {
    args: [string];
    result: AccountTransactionsCount;
  };
  "is-account-indexed": {
    args: [string];
    result: boolean;
  };
  "accounts-list": {
    args: [number, AccountPagination?];
    result: PaginatedAccountBasicInfo[];
  };

  "block-info": {
    args: [string | number];
    result: BlockInfo | null;
  };
  "receipts-count-in-block": {
    args: [string];
    result: number | null;
  };
  "gas-used-in-chunks": {
    args: [string];
    result: string | null;
  };
  "blocks-list": {
    args: [number, number?];
    result: BlockBase[];
  };
  "block-by-hash-or-id": {
    args: [string | number];
    result: string | null;
  };

  "nearcore-final-block": {
    args: [];
    result: RPC.BlockView;
  };
  "nearcore-view-account": {
    args: [string];
    result: RPC.AccountView;
  };
  "nearcore-view-access-key-list": {
    args: [string];
    result: RPC.AccessKeyList;
  };
  "nearcore-total-fee-count": {
    args: [number];
    result: {
      date: string;
      fee: string;
    } | null;
  };

  "contract-info-by-account-id": {
    args: [string];
    result: ContractInfo | null;
  };

  "included-receipts-list-by-block-hash": {
    args: [string];
    result: Receipt[];
  };
  "executed-receipts-list-by-block-hash": {
    args: [string];
    result: Receipt[];
  };
  "transaction-hash-by-receipt-id": {
    args: [string];
    result: TransactionHashByReceiptId | null;
  };

  "get-latest-circulating-supply": {
    args: [];
    result: {
      timestamp: string;
      circulating_supply_in_yoctonear: string;
    };
  };
  "circulating-supply-stats": {
    args: [];
    result: CirculatingSupplyStat[] | null;
  };
  "nearcore-genesis-accounts-count": {
    args: [];
    result: string | null;
  };
  "nearcore-genesis-protocol-configuration": {
    args: [number];
    result: RPC.BlockView;
  };
  "partner-first-3-month-transactions-count": {
    args: [];
    result: AccountTransactionAmount[] | null;
  };
  "partner-total-transactions-count": {
    args: [];
    result: AccountTransactionAmount[] | null;
  };
  "active-contracts-list": {
    args: [];
    result: ContractReceiptsAmount[] | null;
  };
  "active-contracts-count-aggregated-by-date": {
    args: [];
    result: ContractsByDateAmount[] | null;
  };
  "unique-deployed-contracts-count-aggregate-by-date": {
    args: [];
    result: ContractsByDateAmount[] | null;
  };
  "new-contracts-count-aggregated-by-date": {
    args: [];
    result: ContractsByDateAmount[] | null;
  };
  "first-produced-block-timestamp": {
    args: [];
    result: string;
  };
  "active-accounts-list": {
    args: [];
    result: AccountTransactionAmount[] | null;
  };
  "active-accounts-count-aggregated-by-date": {
    args: [];
    result: AccountsByDateAmount[] | null;
  };
  "active-accounts-count-aggregated-by-week": {
    args: [];
    result: AccountsByDateAmount[] | null;
  };
  "live-accounts-count-aggregated-by-date": {
    args: [];
    result: AccountsByDateAmount[] | null;
  };
  "new-accounts-count-aggregated-by-date": {
    args: [];
    result: AccountsByDateAmount[] | null;
  };
  "gas-used-aggregated-by-date": {
    args: [];
    result: GasUsedByDateAmount[] | null;
  };
  "deposit-amount-aggregated-by-date": {
    args: [];
    result: DepositByDateAmount[] | null;
  };
  "partner-unique-user-amount": {
    args: [];
    result: PartnerUserAmount[] | null;
  };
  "transactions-count-aggregated-by-date": {
    args: [];
    result: TransactionsByDateAmount[] | null;
  };

  "nearcore-tx": {
    args: [string, string];
    result: RPC.FinalExecutionOutcomeWithReceiptView;
  };
  "is-transaction-indexed": {
    args: [string];
    result: boolean;
  };
  "transactions-list-by-account-id": {
    args: [string, number, TransactionPagination?];
    result: TransactionBaseInfo[];
  };
  "transactions-list-by-block-hash": {
    args: [string, number, TransactionPagination?];
    result: TransactionBaseInfo[];
  };
  "transactions-list": {
    args: [number, TransactionPagination?];
    result: TransactionBaseInfo[];
  };
  "transaction-info": {
    args: [string];
    result: TransactionBaseInfo | null;
  };
  "nearcore-status": {
    args: [];
    result: RPC.StatusResponse;
  };

  "node-telemetry": {
    args: [TelemetryRequest];
    result: void;
  };
};

export type ProcedureType = keyof ProcedureTypes;

export type ProcedureArgs<P extends ProcedureType> = ProcedureTypes[P]["args"];
// WAMP cannot squeeze undefined through the communication channel
// Though this check doesn't work at the moment
// TODO: Investigate how to force typescript into this kind of checks
// Minimal repro:
// type NeverUndefined<T> = T extends undefined ? never : T;
// type MyType = NeverUndefined<number | undefined> // should be never, actually number
export type ProcedureResult<
  P extends ProcedureType
> = ProcedureTypes[P]["result"] extends undefined
  ? never
  : ProcedureTypes[P]["result"];

// See https://stackoverflow.com/a/49402091/2017859
export type KeysOfUnion<T> = T extends T ? keyof T : never;
export * as RPC from "../../../../backend/src/rpc-types";
