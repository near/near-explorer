import {
  // Bytes,
  AccountId,
  ReceiptId,
  BlockHash,
  TransactionHash,
  UTCTimestamp,
  YoctoNEAR,
} from "./nominal";

import {
  Action,
  KeysOfUnion,
  // TransactionBaseInfo,
  RPC,
} from "../libraries/wamp/types";

export type RpcTransaction = {
  hash: TransactionHash;
  created: {
    timestamp: UTCTimestamp;
    blockHash: BlockHash;
  };
  transactionIndex: number;
  status: KeysOfUnion<RPC.FinalExecutionStatus>;
  transaction: RPC.SignedTransactionView;
  transactionOutcome: TransactionOutcome;
  receipts: RPC.ReceiptView[];
  receiptsOutcome: ReceiptsOutcome[];
};

export type ReceiptsOutcome = Omit<
  RPC.ExecutionOutcomeWithIdView,
  "block_hash"
> & { includedInBlock: TransactionBlockInfo };

export type Transaction = {
  hash: TransactionHash;
  created: {
    timestamp: UTCTimestamp;
    blockHash: BlockHash;
  };
  transaction: RPC.SignedTransactionView;
  transactionIndex: number;
  transactionFee: string;
  transactionOutcome: TransactionOutcome;
  status: KeysOfUnion<RPC.FinalExecutionStatus>;
  gasUsed: string;
  gasAttached: string;
  receipts: TransactionReceipt[];
  refundReceipts: RefundReceipt[];
};

export type TransactionReceipt = {
  actions: Action[];
  deposit: YoctoNEAR | null;
  signerId: string;
  parentReceiptHash: ReceiptId | null;
  includedInBlock: TransactionBlockInfo;
  receiptId: ReceiptId;
  receiverId: AccountId;
  gasBurnt?: number;
  tokensBurnt: YoctoNEAR;
  logs: string[] | [];
  status: RPC.ExecutionStatusView;
};

export type RefundReceipt = {
  actions: Action[];
  deposit: YoctoNEAR | null;
  signerId: string;
  parentReceiptHash: ReceiptId;
  includedInBlockHash?: string;
  receiptId: ReceiptId;
  receiverId: AccountId;
  gasBurnt?: number;
  tokensBurnt: YoctoNEAR;
  logs: string[] | [];
  status: RPC.ExecutionStatusView;
  refund?: YoctoNEAR;
};

export type TransactionOutcome = {
  id: string;
  outcome: RPC.ExecutionOutcomeView;
  block_hash: string;
};

export type TransactionBlockInfo = {
  hash: string;
  height: number;
};

type NestedReceiptWithOutcome = {
  actions?: Action[];
  block_hash: string;
  outcome: ReceiptExecutionOutcome;
  predecessor_id: string;
  receipt_id: string;
  receiver_id: string;
};

type ReceiptExecutionOutcome = {
  tokens_burnt: string;
  logs: string[];
  outgoing_receipts?: NestedReceiptWithOutcome[];
  status: RPC.ExecutionStatusView;
  gas_burnt: number;
};

export enum TransactionError {
  Internal = -1,
}

export type TransactionErrorResponse = {
  error: TransactionError;
  details?: string;
};
