export type TransactionCountHistory = {
  date: string;
  total: number;
};

export interface NodeInfo {
  ipAddress: string;
  accountId?: string;
  nodeId: string;
  lastSeen: number;
  lastHeight: number;
  agentName: string;
  agentVersion: string;
  agentBuild: string;
  status: string;
  latitude: number;
  longitude: number;
  city?: string;
}
export type StakingStatus =
  | "active"
  | "joining"
  | "leaving"
  | "proposal"
  | "idle"
  | "newcomer"
  | "on-hold";

export interface BaseValidationNodeInfo {
  account_id: string;
  is_slashed?: boolean;
  num_produced_blocks?: number;
  num_expected_blocks?: number;
  public_key?: string;
  currentStake: string;
  proposedStake?: string;
  cumulativeStakeAmount?: string;
  stakingStatus?: StakingStatus;
  networkHolder?: boolean;
  shards?: [number];
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
  fee: { numerator: number; denominator: number };
  delegatorsCount: number;
  poolDetails?: PoolDetails;
}

export type ValidationNodeInfo = BaseValidationNodeInfo & StakingPoolInfo;

export type SubscriptionTopicTypes = {
  nodes: {
    onlineNodes: NodeInfo[];
    stakingNodes: ValidationNodeInfo[];
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
  "network-stats": {
    currentValidatorsCount: number;
    currentPoolsCount: number;
    onlineNodesCount: number;
    epochLength: number;
    epochStartHeight: number;
    epochProtocolVersion: number;
    totalStake: string;
    seatPrice: string;
    genesisTime: string;
    genesisHeight: number;
    genesisAccountsCount: number;
  };
};

export type SubscriptionTopicType = keyof SubscriptionTopicTypes;

export type AccountBasicInfo = {
  accountId: string;
  createdByTransactionHash: string;
  createdAtBlockTimestamp: number;
  deletedByTransactionHash: string;
  deletedAtBlockTimestamp: number;
};

export type AccountDetails = {
  stakedBalance: string;
  nonStakedBalance: string;
  storageUsage?: string;
  lockupAccountId?: string;
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

export type AccessKey = {
  // TODO: add types for query with type "view_access_key_list"
  [key: string]: any;
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
  gasBurnt: number;
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
  circulatingTokensSupply: number;
  totalTokensSupply: number;
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

export type TransactionsByDateAmount = {
  date: string;
  transactionsCount: number;
};

export type ExecutionStatus =
  | "NotStarted"
  | "Started"
  | "Failure"
  | "SuccessValue";

export interface CreateAccount {}

export interface DeleteAccount {
  beneficiary_id: string;
}

export interface DeployContract {}

export interface FunctionCall {
  args: string;
  deposit: string;
  gas: number;
  method_name: string;
}

export interface Transfer {
  deposit: string;
}

export interface Stake {
  stake: string;
  public_key: string;
}

export interface AddKey {
  access_key: any;
  public_key: string;
}

export interface DeleteKey {
  public_key: string;
}

export interface RpcActionWithArgs {
  DeleteAccount: DeleteAccount;
  DeployContract: DeployContract;
  FunctionCall: FunctionCall;
  Transfer: Transfer;
  Stake: Stake;
  AddKey: AddKey;
  DeleteKey: DeleteKey;
}

export type ActionWithArgs<
  K extends keyof RpcActionWithArgs = keyof RpcActionWithArgs
> = {
  kind: K;
  args: RpcActionWithArgs[K];
};

export type Action<
  A extends RpcAction = RpcAction
> = A extends RpcActionWithArgs
  ?
      | {
          kind: "DeleteAccount";
          args: DeleteAccount;
        }
      | {
          kind: "DeployContract";
          args: DeployContract;
        }
      | {
          kind: "FunctionCall";
          args: FunctionCall;
        }
      | { kind: "Transfer"; args: Transfer }
      | { kind: "Stake"; args: Stake }
      | { kind: "AddKey"; args: AddKey }
      | { kind: "DeleteKey"; args: DeleteKey }
  : {
      kind: "CreateAccount";
      args: {};
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

export type RpcReceiptSuccessValue = {
  SuccessValue: string | null;
};

export type RpcReceiptFailure = {
  Failure: unknown;
};

export type RpcReceiptSuccessId = {
  SuccessReceiptId: string;
};

export type RpcReceiptStatus =
  | RpcReceiptSuccessValue
  | RpcReceiptFailure
  | RpcReceiptSuccessId
  | string;

export type RpcOutcome = {
  tokens_burnt: string;
  logs: string[];
  receipt_ids: string[];
  status: RpcReceiptStatus;
  gas_burnt: number;
};

export type RpcReceiptOutcome = {
  id: string;
  outcome: RpcOutcome;
  block_hash: string;
};

export type RpcTransactionOutcome = {
  id: string;
  outcome: RpcOutcome;
  block_hash: string;
};

export type RpcAction = "CreateAccount" | RpcActionWithArgs;

export type RpcReceipt = {
  predecessor_id: string;
  receiver_id: string;
  receipt_id: string;
  receipt?: any;
  actions?: RpcAction[];
};

// TODO: add types for RPC call "EXPERIMENTAL_tx_status"
// https://docs.near.org/docs/api/rpc/transactions#transaction-status-with-receipts
export type RPCTransactionStatus = {
  status: Record<ExecutionStatus, string>;
  transaction: {
    signer_id: string;
    receiver_id: string;
    actions: RpcAction[];
  };
  receipts: RpcReceipt[];
  receipts_outcome: RpcReceiptOutcome[];
  transaction_outcome: RpcTransactionOutcome;
};

// TODO: add types for RPC call "status"
// https://docs.near.org/docs/api/rpc/network#node-status
export type RPCNearStatus = {
  protocol_version: number;
  latest_protocol_version: number;
};

// TODO: add types for RPC call "block"
// https://docs.near.org/docs/api/rpc/block-chunk#block-details
export type RPCBlock = {
  header: {
    height: number;
    total_supply: string;
    latest_protocol_version: number;
  };
};

// TODO: add types for RPC call "view_account"
// https://docs.near.org/docs/api/rpc/contracts#view-account
export type RPCViewAccount = {
  code_hash: string;
};

// TODO: verify this type
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
    result: AccountBasicInfo;
  };
  "get-account-details": {
    args: [string];
    result: AccountDetails;
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
    result: BlockInfo;
  };
  "receipts-count-in-block": {
    args: [string];
    result: number;
  };
  "gas-used-in-chunks": {
    args: [string];
    result: string;
  };
  "blocks-list": {
    args: [number, number?];
    result: BlockBase[];
  };
  "block-by-hash-or-id": {
    args: [string | number];
    result: string;
  };

  "nearcore-final-block": {
    args: [];
    result: RPCBlock;
  };
  "nearcore-view-account": {
    args: [string];
    result: RPCViewAccount;
  };
  "nearcore-view-access-key-list": {
    args: [string];
    result: {
      keys: AccessKey[];
    };
  };
  "nearcore-total-fee-count": {
    args: [number];
    result:
      | {
          date: string;
          fee: number;
        }
      | undefined;
  };

  "contract-info-by-account-id": {
    args: [string];
    result: ContractInfo;
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
    result: TransactionHashByReceiptId;
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
    result: CirculatingSupplyStat[];
  };
  "nearcore-genesis-accounts-count": {
    args: [];
    result: number;
  };
  "nearcore-genesis-protocol-configuration": {
    args: [number];
    result: RPCBlock;
  };
  "partner-first-3-month-transactions-count": {
    args: [];
    result: AccountTransactionAmount[];
  };
  "partner-total-transactions-count": {
    args: [];
    result: AccountTransactionAmount[];
  };
  "active-contracts-list": {
    args: [];
    result: ContractReceiptsAmount[];
  };
  "active-contracts-count-aggregated-by-date": {
    args: [];
    result: ContractsByDateAmount[];
  };
  "unique-deployed-contracts-count-aggregate-by-date": {
    args: [];
    result: ContractsByDateAmount[];
  };
  "new-contracts-count-aggregated-by-date": {
    args: [];
    result: ContractsByDateAmount[];
  };
  "first-produced-block-timestamp": {
    args: [];
    result: string;
  };
  "active-accounts-list": {
    args: [];
    result: AccountTransactionAmount[];
  };
  "active-accounts-count-aggregated-by-date": {
    args: [];
    result: AccountsByDateAmount[];
  };
  "active-accounts-count-aggregated-by-week": {
    args: [];
    result: AccountsByDateAmount[];
  };
  "live-accounts-count-aggregated-by-date": {
    args: [];
    result: AccountsByDateAmount[];
  };
  "new-accounts-count-aggregated-by-date": {
    args: [];
    result: AccountsByDateAmount[];
  };
  "gas-used-aggregated-by-date": {
    args: [];
    result: GasUsedByDateAmount[];
  };
  "transactions-count-aggregated-by-date": {
    args: [];
    result: TransactionsByDateAmount[];
  };

  "nearcore-tx": {
    args: [string, string];
    result: RPCTransactionStatus;
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
    result: TransactionBaseInfo | undefined;
  };
  "nearcore-status": {
    args: [];
    result: RPCNearStatus;
  };

  "node-telemetry": {
    args: [TelemetryRequest];
    result: void;
  };
};

export type ProcedureType = keyof ProcedureTypes;

export type ProcedureArgs<P extends ProcedureType> = ProcedureTypes[P]["args"];
export type ProcedureResult<
  P extends ProcedureType
> = ProcedureTypes[P]["result"];
