import { ExplorerApi } from ".";

export type ExecutionStatus =
  | "NotStarted"
  | "Started"
  | "Failure"
  | "SuccessValue";

export interface TransactionInfo {
  actions: Action[];
  hash: string;
  signerId: string;
  receiverId: string;
  blockHash: string;
  blockTimestamp: number;
  status: ExecutionStatus;
  gasPrice: string;
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

export type ReceiptStatus = ReceiptSuccessValue | ReceiptFailure | string;

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
  tail?: boolean;
  limit: number;
}

export default class TransactionsApi extends ExplorerApi {
  async getTransactions(queries: QueryArgs): Promise<Transaction[]> {
    const { signerId, receiverId, transactionHash, blockHash } = queries;
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
    try {
      const transactions = await this.call<TransactionInfo[]>("select", [
        `SELECT transactions.hash, transactions.signer_id as signerId, transactions.receiver_id as receiverId, 
              transactions.block_hash as blockHash, blocks.timestamp as blockTimestamp, blocks.gas_price as gasPrice
          FROM transactions
          LEFT JOIN blocks ON blocks.hash = transactions.block_hash
          ${whereClause.length > 0 ? `WHERE ${whereClause.join(" OR ")}` : ""}
          ORDER BY blocks.height ${queries.tail ? "DESC" : ""}
          LIMIT :limit`,
        queries
      ]);
      if (queries.tail) {
        transactions.reverse();
      }
      await Promise.all(
        transactions.map(async transaction => {
          // TODO: Expose transaction status via transactions list from chunk
          // RPC, and store it during Explorer synchronization.
          //
          // Meanwhile, we query this information in a non-effective manner,
          // that is making a separate query per transaction to nearcore RPC.
          const transactionExtraInfo = await this.call<any>("nearcore-tx", [
            transaction.hash,
            transaction.signerId
          ]);
          transaction.status = Object.keys(
            transactionExtraInfo.status
          )[0] as ExecutionStatus;

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
                args: action[kind]
              };
            }
          });
        })
      );
      return transactions as Transaction[];
    } catch (error) {
      console.error(
        "Transactions.getTransactions failed to fetch data due to:"
      );
      console.error(error);
      throw error;
    }
  }

  async getLatestTransactionsInfo(limit: number = 10): Promise<Transaction[]> {
    return this.getTransactions({ tail: true, limit });
  }

  async getTransactionInfo(
    transactionHash: string
  ): Promise<Transaction | null> {
    try {
      let transactionInfo = await this.getTransactions({
        transactionHash,
        limit: 1
      }).then(it => it[0] || null);
      if (transactionInfo === null) {
        transactionInfo = {
          status: "NotStarted",
          hash: transactionHash,
          signerId: "",
          receiverId: "",
          blockHash: "",
          blockTimestamp: 0,
          actions: [],
          gasPrice: "0"
        };
      } else {
        const transactionExtraInfo = await this.call<any>("nearcore-tx", [
          transactionHash,
          transactionInfo.signerId
        ]);
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
}

// const newactions = await this.call<any>("select",
// [`SELECT actions.transaction_hash, actions.action_index, actions.action_type as kind, actions.action_args as args
// FROM actions
// WHERE actions.transaction_hash = :hash
// ORDER BY actions.action_index`,
// {
//   hash:transaction.hash
// }])
