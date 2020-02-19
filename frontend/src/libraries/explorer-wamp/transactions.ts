import { ExplorerApi } from ".";

export type ExecutionStatus =
  | "NotStarted"
  | "Started"
  | "Failure"
  | "SuccessValue";

export interface TransactionInfo {
  hash: string;
  signerId: string;
  receiverId: string;
  blockHash: string;
  blockTimestamp: number;
  status: ExecutionStatus;
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

export interface Action {
  CreateAccount: CreateAccount;
  DeleteAccount: DeleteAccount;
  DeployContract: DeployContract;
  FunctionCall: FunctionCall;
  Transfer: Transfer;
  Stake: Stake;
  AddKey: AddKey;
  DeleteKey: DeleteKey;
}

export interface ActionWrapper {
  kind: string;
  args: Action[keyof Action] | {};
}

interface StringActions {
  actions: string;
}

export interface Actions {
  actions: (ActionWrapper)[];
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
  Actions &
  ReceiptsOutcomeWrapper &
  TransactionOutcomeWrapper;

export interface FilterArgs {
  signerId?: string;
  receiverId?: string;
  transactionHash?: string;
  blockHash?: string;
  tail?: boolean;
  limit: number;
}

export default class TransactionsApi extends ExplorerApi {
  async getTransactions(filters: FilterArgs): Promise<Transaction[]> {
    const { signerId, receiverId, transactionHash, blockHash } = filters;
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
      const transactions = await this.call<
        (TransactionInfo & (StringActions | Actions))[]
      >("select", [
        `SELECT transactions.hash, transactions.signer_id as signerId, transactions.receiver_id as receiverId, transactions.actions, transactions.block_hash as blockHash, blocks.timestamp as blockTimestamp
          FROM transactions
          LEFT JOIN blocks ON blocks.hash = transactions.block_hash
          ${whereClause.length > 0 ? `WHERE ${whereClause.join(" OR ")}` : ""}
          ORDER BY blocks.height ${filters.tail ? "DESC" : ""}
          LIMIT :limit`,
        filters
      ]);
      if (filters.tail) {
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
          const _actions = transactionExtraInfo.transaction.actions;
          let _uniformActions: ActionWrapper[] = [];
          _actions.map((action: any) => {
            if (typeof action !== "string") {
              const kind = Object.keys(action)[0];
              _uniformActions.push({
                kind: kind,
                args: action[kind]
              });
            } else {
              _uniformActions.push({ kind: action, args: {} });
            }
          });
          console.log(_uniformActions);
          transaction.actions = _actions;
        })
      );
      return transactions as Transaction[];
    } catch (error) {
      console.error(
        "Transactions.getTransactionsInfo failed to fetch data due to:"
      );
      console.error(error);
      throw error;
    }
  }

  async getLatestTransactionsInfo(limit: number = 15): Promise<Transaction[]> {
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
          actions: []
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
