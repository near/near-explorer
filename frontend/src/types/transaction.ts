import {
  // Bytes,
  BlockHash,
  TransactionHash,
  UTCTimestamp,
  // YoctoNEAR,
} from "./nominal";

import {
  Action,
  KeysOfUnion,
  // TransactionBaseInfo,
  RPC,
} from "../libraries/wamp/types";

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
  receipts: NestedReceiptWithOutcome[];
};

export type TransactionOutcome = {
  id: string;
  outcome: RPC.ExecutionOutcomeView;
  block_hash: string;
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
