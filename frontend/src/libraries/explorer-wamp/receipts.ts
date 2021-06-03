import BN from "bn.js";
import { DATA_SOURCE_TYPE } from "../consts";

import { ExplorerApi } from ".";
import TransactionsApi, {
  Action,
  RpcReceipt,
  ReceiptExecutionOutcome,
  TransactionInfo,
} from "./transactions";

export type ReceiptInfo = RpcReceipt &
  TransactionInfo &
  ReceiptExecutionOutcome & {
    executed_in_block_timestamp: number;
    originated_from_transaction_hash?: string;
  };

export interface DbReceiptInfo {
  actions: Action[];
  blockTimestamp: number;
  receiptId: string;
  gasBurnt: number;
  receiverId: string;
  signerId: string;
  status?: ReceiptExecutionStatus;
  originatedFromTransactionHash?: string | null;
  tokensBurnt: string;
}

export type ReceiptExecutionStatus =
  | "Unknown"
  | "Failure"
  | "SuccessValue"
  | "SuccessReceiptId";

export default class ReceiptsApi extends ExplorerApi {
  static indexerCompatibilityReceiptActionKinds = new Map([
    ["SUCCESS_RECEIPT_ID", "SuccessReceiptId"],
    ["SUCCESS_VALUE", "SuccessValue"],
    ["FAILURE", "Failure"],
    [null, "Unknown"],
  ]);
  // expose receipts included in blockHash
  async queryReceiptsList(blockHash: string) {
    try {
      let receipts;
      if (this.dataSource === DATA_SOURCE_TYPE.LEGACY_SYNC_BACKEND) {
        receipts = undefined;
      } else if (this.dataSource === DATA_SOURCE_TYPE.INDEXER_BACKEND) {
        const actionsByReceiptId = new Map();
        const receiptByIdList = new Map();
        const receiptsIds: string[] = [];

        receipts = await this.call<any>("select:INDEXER_BACKEND", [
          `SELECT
            receipts.receipt_id,
            receipts.originated_from_transaction_hash,
            receipts.predecessor_account_id AS predecessor_id,
            receipts.receiver_account_id AS receiver_id,
            execution_outcomes.status,
            execution_outcomes.gas_burnt,
            execution_outcomes.tokens_burnt,
            execution_outcomes.executed_in_block_timestamp,
            action_receipt_actions.action_kind AS kind,
            action_receipt_actions.args
          FROM receipts
          LEFT JOIN execution_outcomes ON execution_outcomes.receipt_id = receipts.receipt_id
          LEFT JOIN action_receipt_actions ON action_receipt_actions.receipt_id = receipts.receipt_id
          WHERE receipts.included_in_block_hash = :blockHash
          AND receipts.receipt_kind = 'ACTION'`,
          {
            blockHash,
          },
        ]);

        if (receipts) {
          const actionsArray = receipts.map(
            ({ receipt_id, args, kind }: RpcReceipt & Action) => ({
              receipt_id,
              args,
              kind,
            })
          );
          actionsArray.forEach(
            ({ receipt_id, args, kind }: RpcReceipt & Action) => {
              const receiptAction = actionsByReceiptId.get(receipt_id);
              if (receiptAction) {
                receiptAction.push({
                  args,
                  kind: TransactionsApi.indexerCompatibilityActionKinds.get(
                    kind
                  ),
                });
              } else {
                receiptsIds.push(receipt_id);
                actionsByReceiptId.set(receipt_id, [
                  {
                    args,
                    kind: TransactionsApi.indexerCompatibilityActionKinds.get(
                      kind
                    ),
                  },
                ]);
              }
            }
          );

          receipts.forEach((receipt: ReceiptInfo) => {
            const receiptById = receiptByIdList.get(receipt.receipt_id);
            if (!receiptById) {
              receiptByIdList.set(receipt.receipt_id, {
                actions: actionsByReceiptId.get(receipt.receipt_id),
                blockTimestamp: new BN(receipt.executed_in_block_timestamp)
                  .divn(10 ** 6)
                  .toNumber(),
                gasBurnt: receipt.gas_burnt,
                receiptId: receipt.receipt_id,
                receiverId: receipt.receiver_id,
                signerId: receipt.predecessor_id,
                status: ReceiptsApi.indexerCompatibilityReceiptActionKinds.get(
                  receipt.status
                ),
                originatedFromTransactionHash:
                  receipt.originated_from_transaction_hash,
                tokensBurnt: receipt.tokens_burnt,
              });
            }
          });

          receipts = receiptsIds.map((receiptId) =>
            receiptByIdList.get(receiptId)
          );
        }
      } else {
        throw Error(`unsupported data source ${this.dataSource}`);
      }
      return receipts;
    } catch (error) {
      console.error("Receipts.queryReceiptsList failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }

  async queryReceiptsCountInBlock(blockHash: string) {
    try {
      let receiptsCount;
      if (this.dataSource === DATA_SOURCE_TYPE.LEGACY_SYNC_BACKEND) {
        receiptsCount = undefined;
      } else if (this.dataSource === DATA_SOURCE_TYPE.INDEXER_BACKEND) {
        receiptsCount = await this.call<any>("select:INDEXER_BACKEND", [
          `SELECT
            COUNT(receipt_id)
          FROM receipts
          WHERE receipts.included_in_block_hash = :blockHash`,
          {
            blockHash,
          },
        ]).then((receipts) =>
          receipts.length === 0 ? undefined : receipts[0]
        );
        return receiptsCount;
      }
    } catch (error) {
      console.error(
        "Receipts.queryReceiptsCountInBlock failed to fetch data due to:"
      );
      console.error(error);
      throw error;
    }
  }
}
