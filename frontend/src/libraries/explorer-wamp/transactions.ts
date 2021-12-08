import { ExplorerApi } from ".";

export type ExecutionStatus =
  | "NotStarted"
  | "Started"
  | "Failure"
  | "SuccessValue";

export interface TransactionBaseInfo {
  hash: string;
  signerId: string;
  receiverId: string;
  blockHash: string;
  blockTimestamp: number;
  transactionIndex: number;
  actions: Action[];
}
export type TransactionInfo = TransactionBaseInfo & {
  status?: ExecutionStatus;
};

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

export interface RpcAction {
  CreateAccount: CreateAccount;
  DeleteAccount: DeleteAccount;
  DeployContract: DeployContract;
  FunctionCall: FunctionCall;
  Transfer: Transfer;
  Stake: Stake;
  AddKey: AddKey;
  DeleteKey: DeleteKey;
}

export interface Action {
  kind: keyof RpcAction;
  args: RpcAction[keyof RpcAction] | {};
}

export interface ReceiptSuccessValue {
  SuccessValue: string | null;
}

export interface ReceiptFailure {
  Failure: any;
}

export interface ReceiptSuccessId {
  SuccessReceiptId: string;
}

export type ReceiptStatus =
  | ReceiptSuccessValue
  | ReceiptFailure
  | ReceiptSuccessId
  | string;

export interface Outcome {
  tokens_burnt: string;
  logs: string[];
  receipt_ids: string[];
  status: ReceiptStatus;
  gas_burnt: number;
}

export interface ReceiptOutcome {
  id: string;
  outcome: Outcome;
  block_hash: string;
}

export interface ReceiptsOutcomeWrapper {
  receiptsOutcome?: ReceiptOutcome[];
}
interface RpcReceipt {
  predecessor_id: string;
  receiver_id: string;
  receipt_id: string;
  receipt?: any;
  actions?: Action[];
}
export interface NestedReceiptWithOutcome {
  actions?: Action[];
  block_hash: string;
  outcome: ReceiptExecutionOutcome;
  predecessor_id: string;
  receipt_id: string;
  receiver_id: string;
}

export interface ReceiptExecutionOutcome {
  tokens_burnt: string;
  logs: string[];
  outgoing_receipts?: NestedReceiptWithOutcome[];
  status: ReceiptStatus;
  gas_burnt: number;
}

export interface TransactionOutcome {
  id: string;
  outcome: Outcome;
  block_hash: string;
}

export interface TransactionOutcomeWrapper {
  transactionOutcome?: TransactionOutcome;
}

export type Transaction = TransactionInfo &
  ReceiptsOutcomeWrapper &
  TransactionOutcomeWrapper & { receipt?: NestedReceiptWithOutcome };

export interface TxPagination {
  endTimestamp: number;
  transactionIndex: number;
}

export default class TransactionsApi extends ExplorerApi {
  async getTransactions(
    limit = 15,
    paginationIndexer?: TxPagination
  ): Promise<Transaction[]> {
    try {
      return await this.call<TransactionBaseInfo[]>("transactions-list", [
        limit,
        paginationIndexer,
      ]);
    } catch (error) {
      console.error(
        "TransactionsApi.getTransactions failed to fetch data due to:"
      );
      console.error(error);
      throw error;
    }
  }

  async getAccountTransactionsList(
    accountId: string,
    limit = 15,
    paginationIndexer?: TxPagination
  ): Promise<Transaction[]> {
    try {
      return await this.call<TransactionBaseInfo[]>(
        "transactions-list-by-account-id",
        [accountId, limit, paginationIndexer]
      );
    } catch (error) {
      console.error(
        "TransactionsApi.getAccountTransactionsList failed to fetch data due to:"
      );
      console.error(error);
      throw error;
    }
  }

  async getTransactionsListInBlock(
    blockHash: string,
    limit = 15,
    paginationIndexer?: TxPagination
  ): Promise<Transaction[]> {
    try {
      return await this.call<TransactionBaseInfo[]>(
        "transactions-list-by-block-hash",
        [blockHash, limit, paginationIndexer]
      );
    } catch (error) {
      console.error(
        "TransactionsApi.getTransactionsListInBlock failed to fetch data due to:"
      );
      console.error(error);
      throw error;
    }
  }

  async getTransactionStatus(
    transactionHash: string,
    signerId: string
  ): Promise<any> {
    // TODO: Expose transaction status via transactions list from chunk
    // RPC, and store it during Explorer synchronization.
    //
    // Meanwhile, we query this information in a non-effective manner,
    // that is making a separate query per transaction to nearcore RPC.
    let transactionExtraInfo;
    try {
      transactionExtraInfo = await this.getRpcTransactionInfo(
        transactionHash,
        signerId
      );
    } catch (error) {
      console.error(
        "TransactionsApi.getTransactionStatus failed to fetch data due to:"
      );
      console.error(error);
      throw error;
    }
    if (!transactionExtraInfo || !transactionExtraInfo.status) {
      throw new Error(
        `TransactionsApi.getTransactionStatus: failed to fetch status for transaction '${transactionHash}'`
      );
    }
    return Object.keys(transactionExtraInfo.status)[0] as ExecutionStatus;
  }

  async getTransactionInfo(
    transactionHash: string
  ): Promise<Transaction | null> {
    let transactionInfo;
    try {
      transactionInfo = await this.call<any>("transaction-info", [
        transactionHash,
      ]);
    } catch (error) {
      console.error(
        "TransactionsApi.getTransactionInfo failed to fetch data due to:"
      );
      console.error(error);
      throw error;
    }

    if (!transactionInfo) {
      throw new Error(
        `TransactionsApi.getTransactionInfo: transaction '${transactionHash}' not found`
      );
    }

    let transactionExtraInfo;

    try {
      transactionExtraInfo = await this.getRpcTransactionInfo(
        transactionInfo.hash,
        transactionInfo.signerId
      );
    } catch (error) {
      console.error(
        "TransactionsApi.getTransactionInfo failed to fetch data due to:"
      );
      console.error(error);
      throw error;
    }

    if (!transactionExtraInfo) {
      throw new Error(
        `TransactionsApi.getTransactionInfo: transaction info from RPC for transaction '${transactionHash}' not found`
      );
    }

    transactionInfo.status = Object.keys(
      transactionExtraInfo.status
    )[0] as ExecutionStatus;

    const actions = transactionExtraInfo.transaction.actions.map(
      (action: RpcAction | string) => {
        if (typeof action === "string") {
          return { kind: action, args: {} };
        } else {
          const kind = Object.keys(action)[0] as keyof RpcAction;
          return {
            kind,
            args: action[kind],
          };
        }
      }
    );

    let receipts = transactionExtraInfo.receipts as RpcReceipt[];
    const receiptsOutcome = transactionExtraInfo.receipts_outcome as ReceiptOutcome[];
    if (
      receipts.length === 0 ||
      receipts[0].receipt_id !== receiptsOutcome[0].id
    ) {
      receipts.unshift({
        predecessor_id: transactionExtraInfo.transaction.signer_id,
        receipt: actions,
        receipt_id: receiptsOutcome[0].id,
        receiver_id: transactionExtraInfo.transaction.receiver_id,
      });
    }
    const receiptOutcomesByIdMap = new Map();
    receiptsOutcome.forEach((receipt: any) => {
      receiptOutcomesByIdMap.set(receipt.id, receipt);
    });

    const receiptsByIdMap = new Map();
    receipts.forEach((receiptItem: any) => {
      if (receiptItem.receipt_id === receiptsOutcome[0].id) {
        receiptItem.actions = actions;
      } else {
        const { Action: action = undefined } = receiptItem.receipt;
        receiptItem.actions = action?.actions.map(
          (action: RpcAction | string) => {
            if (typeof action === "string") {
              return { kind: action, args: {} };
            } else {
              const kind = Object.keys(action)[0] as keyof RpcAction;
              return {
                kind,
                args: action[kind],
              };
            }
          }
        );
      }
      receiptsByIdMap.set(receiptItem.receipt_id, receiptItem);
    });

    const collectNestedReceiptWithOutcome = (receiptHash: string) => {
      const receipt = receiptsByIdMap.get(receiptHash);
      const receiptOutcome = receiptOutcomesByIdMap.get(receiptHash);
      return {
        ...receipt,
        ...receiptOutcome,
        outcome: {
          ...receiptOutcome.outcome,
          outgoing_receipts: receiptOutcome.outcome.receipt_ids.map(
            (executedReceipt: string) =>
              collectNestedReceiptWithOutcome(executedReceipt)
          ),
        },
      };
    };

    transactionInfo.actions = actions;
    transactionInfo.receiptsOutcome = receiptsOutcome;
    transactionInfo.receipt = collectNestedReceiptWithOutcome(
      receiptsOutcome[0].id
    ) as NestedReceiptWithOutcome;
    transactionInfo.transactionOutcome = transactionExtraInfo.transaction_outcome as TransactionOutcome;

    return transactionInfo;
  }

  async isTransactionIndexed(transactionHash: string): Promise<boolean> {
    return await this.call<boolean>("is-transaction-indexed", [
      transactionHash,
    ]);
  }

  async getRpcTransactionInfo(
    transactionHash: string,
    signerId: string
  ): Promise<any> {
    let transactionRpcInfo;
    try {
      transactionRpcInfo = await this.call<any>("nearcore-tx", [
        transactionHash,
        signerId,
      ]);
    } catch (error) {
      console.error(
        "TransactionsApi.getRpcTransactionInfo failed to fetch data due to:"
      );
      console.error(error);
      throw error;
    }
    if (!transactionRpcInfo) {
      throw new Error(
        `TransactionsApi.getRpcTransactionInfo: failed to fetch transaction info from RPC for transaction '${transactionHash}'`
      );
    }
    return transactionRpcInfo;
  }
}
