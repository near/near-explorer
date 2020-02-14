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
  txHeight: number;
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

interface StringActions {
  actions: string;
}

export interface Actions {
  actions: (Action | keyof Action)[];
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
  offset: number;
}

export default class TransactionsApi extends ExplorerApi {
  async getTXLength(accountId: string = ""): Promise<number> {
    try {
      return await this.call<any>("select", [
        `SELECT COUNT(transaction.hash) as length FROM transactions
        LEFT JOIN blocks ON blocks.hash = transactions.block_hash
        WHERE transactions.signer_id = :accountId OR transactions.receiver_id = :accountId`,
        {
          accountId: accountId === "" ? "" : accountId
        }
      ]).then(it => it[0].length);
    } catch (error) {
      console.error("Transactions.getTXLength failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }

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
        `SELECT transactions.hash, transactions.signer_id as signerId, transactions.receiver_id as receiverId, transactions.actions, 
          transactions.block_hash as blockHash, blocks.timestamp as blockTimestamp, transactions.tx_height as txHeight
            FROM transactions
            LEFT JOIN blocks ON blocks.hash = transactions.block_hash
            ${whereClause.length > 0 ? `WHERE ${whereClause.join(" OR ")}` : ""}
            ORDER BY txHeight ${filters.tail ? "DESC" : ""}
            LIMIT :limit OFFSET :offset`,
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

          try {
            transaction.actions = JSON.parse(transaction.actions as string);
          } catch {}
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

  async getLatestTransactionsInfo(
    limit: number = 10,
    offset: number = 0
  ): Promise<Transaction[]> {
    return this.getTransactions({ tail: true, limit, offset });
  }

  async getTransactionInfo(
    transactionHash: string
  ): Promise<Transaction | null> {
    try {
      let transactionInfo = await this.getTransactions({
        transactionHash,
        limit: 1,
        offset: 0
      }).then(it => it[0] || null);

      if (transactionInfo === null) {
        transactionInfo = {
          status: "NotStarted",
          hash: transactionHash,
          signerId: "",
          receiverId: "",
          blockHash: "",
          blockTimestamp: 0,
          txHeight: 0,
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
