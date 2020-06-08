import { ExplorerApi } from ".";

export type ExecutionStatus =
  | "NotStarted"
  | "Started"
  | "Failure"
  | "SuccessValue";

export interface TransactionInfo {
  actions?: Action[];
  hash: string;
  signerId: string;
  receiverId: string;
  blockHash: string;
  blockTimestamp: number;
  status?: ExecutionStatus;
  isFinal?: boolean;
}

export interface CreateAccount {}

export interface DeleteAccount {}

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
  TransactionOutcomeWrapper;

export interface QueryArgs {
  signerId?: string;
  receiverId?: string;
  transactionHash?: string;
  blockHash?: string;
  limit: number;
  paginationIndexer?: number;
}

export default class TransactionsApi extends ExplorerApi {
  async getTransactions(queries: QueryArgs): Promise<Transaction[]> {
    const {
      signerId,
      receiverId,
      transactionHash,
      blockHash,
      paginationIndexer,
    } = queries;
    const whereClause = [];
    if (signerId) {
      whereClause.push(`transactions.signer_id = :signerId`);
    }
    if (receiverId) {
      whereClause.push(`transactions.receiver_id = :receiverId`);
    }
    if (transactionHash) {
      whereClause.push(`transactions.hash = :transactionHash`);
    }
    if (blockHash) {
      whereClause.push(`transactions.block_hash = :blockHash`);
    }
    let WHEREClause;
    if (whereClause.length > 0) {
      if (paginationIndexer) {
        WHEREClause = `WHERE block_timestamp < :paginationIndexer AND (${whereClause.join(
          " OR "
        )})`;
      } else {
        WHEREClause = `WHERE ${whereClause.join(" OR ")}`;
      }
    } else {
      if (paginationIndexer) {
        WHEREClause = `WHERE block_timestamp < :paginationIndexer`;
      } else {
        WHEREClause = "";
      }
    }
    try {
      const transactions = await this.call<TransactionInfo[]>("select", [
        `SELECT transactions.hash, transactions.signer_id as signerId, transactions.receiver_id as receiverId, 
              transactions.block_hash as blockHash, transactions.block_timestamp as blockTimestamp
          FROM transactions
          ${WHEREClause}
          ORDER BY block_timestamp DESC
          LIMIT :limit`,
        queries,
      ]);
      return transactions as Transaction[];
    } catch (error) {
      console.error(
        "Transactions.getTransactions failed to fetch data due to:"
      );
      console.error(error);
      throw error;
    }
  }

  async getTransactionStatus(transaction: TransactionInfo): Promise<any> {
    // TODO: Expose transaction status via transactions list from chunk
    // RPC, and store it during Explorer synchronization.
    //
    // Meanwhile, we query this information in a non-effective manner,
    // that is making a separate query per transaction to nearcore RPC.
    const [transactionExtraInfo, finalTimestamp] = await Promise.all([
      this.call<any>("nearcore-tx", [transaction.hash, transaction.signerId]),
      this.queryFinalTimestamp(),
    ]);
    transaction.status = Object.keys(
      transactionExtraInfo.status
    )[0] as ExecutionStatus;
    transaction.isFinal = transaction.blockTimestamp <= finalTimestamp;

    // Given we already queried the information from the node, we can use the actions,
    // since DeployContract.code and FunctionCall.args are stripped away due to their size.
    //
    // Once the above TODO is resolved, we should just move this to TransactionInfo method
    // (i.e. query the information there only for the specific transaction).

    const actions = transactionExtraInfo.transaction.actions;
    transaction.actions = actions.map((action: RpcAction | string) => {
      if (typeof action === "string") {
        return { kind: action, args: {} };
      } else {
        const kind = Object.keys(action)[0] as keyof RpcAction;
        return {
          kind,
          args: action[kind],
        };
      }
    });
    return transaction as TransactionInfo;
  }

  async getLatestTransactionsInfo(limit: number = 10): Promise<Transaction[]> {
    return this.getTransactions({ limit });
  }

  async getTransactionInfo(
    transactionHash: string
  ): Promise<Transaction | null> {
    try {
      let transactionInfo = await this.getTransactions({
        transactionHash,
        limit: 1,
      }).then((it) => it[0] || null);
      if (transactionInfo === null) {
        transactionInfo = {
          status: "NotStarted",
          hash: transactionHash,
          signerId: "",
          receiverId: "",
          blockHash: "",
          blockTimestamp: 0,
          actions: [],
        };
      } else {
        const [transactionExtraInfo, finalTimestamp] = await Promise.all([
          this.call<any>("nearcore-tx", [
            transactionInfo.hash,
            transactionInfo.signerId,
          ]),
          this.queryFinalTimestamp(),
        ]);
        transactionInfo.status = Object.keys(
          transactionExtraInfo.status
        )[0] as ExecutionStatus;
        transactionInfo.isFinal =
          transactionInfo.blockTimestamp <= finalTimestamp;
        const actions = transactionExtraInfo.transaction.actions;
        transactionInfo.actions = actions.map((action: RpcAction | string) => {
          if (typeof action === "string") {
            return { kind: action, args: {} };
          } else {
            const kind = Object.keys(action)[0] as keyof RpcAction;
            return {
              kind,
              args: action[kind],
            };
          }
        });

        transactionInfo.receiptsOutcome = transactionExtraInfo.receipts_outcome as ReceiptOutcome[];
        transactionInfo.transactionOutcome = transactionExtraInfo.transaction_outcome as TransactionOutcome;
      }
      return transactionInfo;
    } catch (error) {
      console.error(
        "Transactions.getTransactionInfo failed to fetch data due to:"
      );
      console.error(error);
      throw error;
    }
  }

  async queryFinalTimestamp(): Promise<any> {
    const finalBlock = await this.call<any>("get-finality-stats");
    return finalBlock.header.timestamp;
  }
}

// ActionTable Query FUTURE WORK
// const actions = await this.call<any>("select", [
//   `SELECT actions.transaction_hash, actions.action_index, actions.action_type as kind, actions.action_args as args
// FROM actions
// WHERE actions.transaction_hash = :hash
// ORDER BY actions.action_index`,
//   {
//     hash: transaction.hash
//   }
// ]);
// transaction.actions = actions.map((action: any) => {
//   if (typeof action === "string") {
//     return { kind: action, args: {} };
//   } else {
//     return {
//       kind: action.kind,
//       args: JSON.parse(action.args)
//     };
//   }
// });
