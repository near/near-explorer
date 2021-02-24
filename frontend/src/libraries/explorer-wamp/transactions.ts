import BN from "bn.js";

import { DATA_SOURCE_TYPE } from "../consts";

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
  transactionIndex: number;
  status?: ExecutionStatus;
}

export interface CreateAccount {}

export interface DeleteAccount {
  benefeciar_id: string;
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

export interface TxPagination {
  endTimestamp: number;
  transactionIndex: number;
}
export interface QueryArgs {
  signerId?: string;
  receiverId?: string;
  transactionHash?: string;
  blockHash?: string;
  limit: number;
  paginationIndexer?: TxPagination;
}

export default class TransactionsApi extends ExplorerApi {
  static indexerCompatibilityActionKinds = new Map([
    ["ADD_KEY", "AddKey"],
    ["CREATE_ACCOUNT", "CreateAccount"],
    ["DELETE_ACCOUNT", "DeleteAccount"],
    ["DELETE_KEY", "DeleteKey"],
    ["DEPLOY_CONTRACT", "DeployContract"],
    ["FUNCTION_CALL", "FunctionCall"],
    ["STAKE", "Stake"],
    ["TRANSFER", "Transfer"],
  ]);

  async getTransactions(queries: QueryArgs) {
    if (this.dataSource === DATA_SOURCE_TYPE.LEGACY_SYNC_BACKEND) {
      return await this.getTransactionsFromLegacy(queries);
    } else if (this.dataSource === DATA_SOURCE_TYPE.INDEXER_BACKEND) {
      return await this.getTransactionsFromIndexer(queries);
    } else {
      throw Error(`unsupported data source ${this.dataSource}`);
    }
  }

  async getTransactionsFromLegacy(queries: QueryArgs): Promise<Transaction[]> {
    const {
      signerId,
      receiverId,
      transactionHash,
      blockHash,
      paginationIndexer,
    } = queries;
    const whereClause = [];
    if (signerId) {
      whereClause.push(`signer_id = :signerId`);
    }
    if (receiverId) {
      whereClause.push(`receiver_id = :receiverId`);
    }
    if (transactionHash) {
      whereClause.push(`hash = :transactionHash`);
    }
    if (blockHash) {
      whereClause.push(`block_hash = :blockHash`);
    }
    let WHEREClause;
    if (whereClause.length > 0) {
      if (paginationIndexer) {
        WHEREClause = `WHERE (${whereClause.join(
          " OR "
        )}) AND (block_timestamp < :endTimestamp OR (block_timestamp = :endTimestamp AND transaction_index < :transactionIndex))`;
      } else {
        WHEREClause = `WHERE ${whereClause.join(" OR ")}`;
      }
    } else {
      if (paginationIndexer) {
        WHEREClause = `WHERE block_timestamp < :endTimestamp OR (block_timestamp = :endTimestamp AND transaction_index < :transactionIndex)`;
      } else {
        WHEREClause = "";
      }
    }
    try {
      const transactions = await this.call<TransactionInfo[]>("select", [
        `SELECT hash, signer_id as signerId, receiver_id as receiverId, 
              block_hash as blockHash, block_timestamp as blockTimestamp, transaction_index as transactionIndex
          FROM transactions
          ${WHEREClause}
          ORDER BY block_timestamp DESC, transaction_index DESC
          LIMIT :limit`,
        {
          ...queries,
          endTimestamp: queries.paginationIndexer?.endTimestamp,
          transactionIndex: queries.paginationIndexer?.transactionIndex,
        },
      ]);

      if (transactions.length > 0) {
        let transactionHashes = transactions.map(
          (transaction) => transaction.hash
        );
        const actionsArray = await this.call<any>("select", [
          `SELECT transaction_hash, action_type as kind, action_args as args
            FROM actions
            WHERE transaction_hash IN (:transactionHashes)
            ORDER BY action_index`,
          { transactionHashes },
        ]);
        const actionsByTransactionHash = new Map();
        actionsArray.forEach((action: any) => {
          const transactionActions = actionsByTransactionHash.get(
            action.transaction_hash
          );
          if (transactionActions) {
            transactionActions.push(action);
          } else {
            actionsByTransactionHash.set(action.transaction_hash, [action]);
          }
        });
        transactions.map((transaction) => {
          const transactionActions = actionsByTransactionHash.get(
            transaction.hash
          );
          if (transactionActions) {
            transaction.actions = transactionActions.map((action: any) => {
              return {
                kind: action.kind,
                args:
                  typeof action.args === "string"
                    ? JSON.parse(action.args)
                    : action.args,
              };
            });
          }
        });
      }
      return transactions as Transaction[];
    } catch (error) {
      console.error(
        "Transactions.getTransactionsFromLegacy failed to fetch data due to:"
      );
      console.error(error);
      throw error;
    }
  }

  async getTransactionsFromIndexer(queries: QueryArgs): Promise<Transaction[]> {
    const {
      signerId,
      receiverId,
      transactionHash,
      blockHash,
      paginationIndexer,
      limit,
    } = queries;
    const whereClause = [];
    if (signerId || receiverId) {
      const accountIdWhereClause = [];
      if (signerId) {
        accountIdWhereClause.push(
          `receipts.predecessor_account_id = :signer_id`
        );
      }
      if (receiverId) {
        accountIdWhereClause.push(
          `receipts.receiver_account_id = :receiver_id`
        );
      }
      whereClause.push(
        `transaction_hash IN (SELECT DISTINCT originated_from_transaction_hash FROM receipts WHERE ${accountIdWhereClause.join(
          " OR "
        )})`
      );
    }
    if (transactionHash) {
      whereClause.push(`transactions.transaction_hash = :transaction_hash`);
    }
    if (blockHash) {
      whereClause.push(`transactions.included_in_block_hash = :block_hash`);
    }
    let WHEREClause;
    if (whereClause.length > 0) {
      if (paginationIndexer) {
        WHEREClause = `WHERE (${whereClause.join(
          " OR "
        )}) AND (transactions.block_timestamp < :end_timestamp OR (transactions.block_timestamp = :end_timestamp AND transactions.index_in_chunk < :transaction_index))`;
      } else {
        WHEREClause = `WHERE ${whereClause.join(" OR ")}`;
      }
    } else {
      if (paginationIndexer) {
        WHEREClause = `WHERE transactions.block_timestamp < :end_timestamp OR (transactions.block_timestamp = :end_timestamp AND transactions.index_in_chunk < :transaction_index)`;
      } else {
        WHEREClause = "";
      }
    }
    try {
      let transactions = await this.call<any>("select:INDEXER_BACKEND", [
        `SELECT
            transactions.transaction_hash as hash,
            transactions.signer_account_id as signer_id,
            transactions.receiver_account_id as receiver_id,
            transactions.included_in_block_hash as block_hash,
            DIV(transactions.block_timestamp, 1000*1000) as block_timestamp,
            transactions.index_in_chunk as transaction_index
          FROM transactions
          ${WHEREClause}
          ORDER BY transactions.block_timestamp DESC, transactions.index_in_chunk DESC
          LIMIT :limit`,
        {
          signer_id: signerId,
          receiver_id: receiverId,
          transaction_hash: transactionHash,
          block_hash: blockHash,
          end_timestamp: queries.paginationIndexer
            ? new BN(queries.paginationIndexer.endTimestamp)
                .muln(10 ** 6)
                .toString()
            : undefined,
          transaction_index: queries.paginationIndexer?.transactionIndex,
          limit,
        },
      ]);

      if (transactions.length > 0) {
        let transactionHashes = transactions.map(
          (transaction: any) => transaction.hash
        );
        const actionsArray = await this.call<any>("select:INDEXER_BACKEND", [
          `SELECT transaction_hash, action_kind as kind, args
            FROM transaction_actions
            WHERE transaction_hash IN (:transactionHashes)`,
          { transactionHashes },
        ]);
        const actionsByTransactionHash = new Map();
        actionsArray.forEach((action: any) => {
          const transactionActions = actionsByTransactionHash.get(
            action.transaction_hash
          );
          if (transactionActions) {
            transactionActions.push(action);
          } else {
            actionsByTransactionHash.set(action.transaction_hash, [action]);
          }
        });
        transactions.map((transaction: any) => {
          const transactionActions = actionsByTransactionHash.get(
            transaction.hash
          );
          if (transactionActions) {
            transaction.actions = transactionActions.map((action: any) => {
              return {
                kind: TransactionsApi.indexerCompatibilityActionKinds.get(
                  action.kind
                ),
                args:
                  typeof action.args === "string"
                    ? JSON.parse(action.args)
                    : action.args,
              };
            });
          }
        });
      }
      transactions = transactions.map((transaction: any) => {
        return {
          hash: transaction.hash,
          signerId: transaction.signer_id,
          receiverId: transaction.receiver_id,
          blockHash: transaction.block_hash,
          blockTimestamp: parseInt(transaction.block_timestamp),
          transactionIndex: transaction.transaction_index,
          actions: transaction.actions,
        };
      });
      return transactions;
    } catch (error) {
      console.error(
        "Transactions.getTransactionsFromIndexer failed to fetch data due to:"
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
    const transactionExtraInfo = await this.call<any>("nearcore-tx", [
      transaction.hash,
      transaction.signerId,
    ]);
    const status = Object.keys(
      transactionExtraInfo.status
    )[0] as ExecutionStatus;
    return status;
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
          transactionIndex: 0,
          actions: [],
        };
      } else {
        const transactionExtraInfo = await this.call<any>("nearcore-tx", [
          transactionInfo.hash,
          transactionInfo.signerId,
        ]);
        transactionInfo.status = Object.keys(
          transactionExtraInfo.status
        )[0] as ExecutionStatus;

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
}
