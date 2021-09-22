import BN from "bn.js";

import { ExplorerApi } from ".";
import TransactionsApi, { Action } from "./transactions";

export interface Receipt {
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
  static indexerCompatibilityReceiptActionKinds = new Map<
    string | null,
    ReceiptExecutionStatus
  >([
    ["SUCCESS_RECEIPT_ID", "SuccessReceiptId"],
    ["SUCCESS_VALUE", "SuccessValue"],
    ["FAILURE", "Failure"],
    [null, "Unknown"],
  ]);
  // expose receipts included in blockHash
  async queryReceiptsList(blockHash: string) {
    try {
      const receiptActions = await this.call<any>("select:INDEXER_BACKEND", [
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
        FROM action_receipt_actions
        LEFT JOIN receipts ON receipts.receipt_id = action_receipt_actions.receipt_id
        LEFT JOIN execution_outcomes ON execution_outcomes.receipt_id = action_receipt_actions.receipt_id
        WHERE receipts.included_in_block_hash = :blockHash
        AND receipts.receipt_kind = 'ACTION'
        ORDER BY receipts.included_in_chunk_hash, receipts.index_in_chunk, action_receipt_actions.index_in_action_receipt`,
        {
          blockHash,
        },
      ]);

      // The receipt actions are ordered in such a way that the actions for a single receipt go
      // one after another in a correct order, so we can collect them linearly using a moving
      // window based on the `previousReceiptId`.
      let receipts: Receipt[] = [];
      let actions: Action[];
      let previousReceiptId: string = "";
      for (const receiptAction of receiptActions) {
        if (previousReceiptId !== receiptAction.receipt_id) {
          previousReceiptId = receiptAction.receipt_id;
          actions = [];
          const receipt = {
            actions,
            blockTimestamp: new BN(receiptAction.executed_in_block_timestamp)
              .divn(10 ** 6)
              .toNumber(),
            gasBurnt: receiptAction.gas_burnt,
            receiptId: receiptAction.receipt_id,
            receiverId: receiptAction.receiver_id,
            signerId: receiptAction.predecessor_id,
            status: ReceiptsApi.indexerCompatibilityReceiptActionKinds.get(
              receiptAction.status
            ),
            originatedFromTransactionHash:
              receiptAction.originated_from_transaction_hash,
            tokensBurnt: receiptAction.tokens_burnt,
          };
          receipts.push(receipt);
        }
        actions!.push({
          args: receiptAction.args,
          kind: TransactionsApi.indexerCompatibilityActionKinds.get(
            receiptAction.kind
          )!,
        });
      }
      return receipts;
    } catch (error) {
      console.error("Receipts.queryReceiptsList failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }

  async queryReceiptsCountInBlock(blockHash: string): Promise<number> {
    try {
      return await this.call<any>("select:INDEXER_BACKEND", [
        `SELECT
          COUNT(receipt_id)
        FROM receipts
        WHERE receipts.included_in_block_hash = :blockHash`,
        {
          blockHash,
        },
      ]).then((receipts) => receipts[0]);
    } catch (error) {
      console.error(
        "Receipts.queryReceiptsCountInBlock failed to fetch data due to:"
      );
      console.error(error);
      throw error;
    }
  }
}
