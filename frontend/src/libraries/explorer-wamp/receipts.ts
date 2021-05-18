import { DATA_SOURCE_TYPE } from "../consts";

import { ExplorerApi } from ".";

export default class ReceiptsApi extends ExplorerApi {
  // expose receipts included in blockHash
  async queryReceiptsList(blockHash: string) {
    try {
      let receipts;
      if (this.dataSource === DATA_SOURCE_TYPE.LEGACY_SYNC_BACKEND) {
        receipts = undefined;
      } else if (this.dataSource === DATA_SOURCE_TYPE.INDEXER_BACKEND) {
        receipts = await this.call<any>("select:INDEXER_BACKEND", [
          `SELECT
            receipts.receipt_id, receipts.receipt_kind,
            receipts.predecessor_account_id, receipts.receiver_account_id,
            execution_outcomes.status, execution_outcomes.gas_burnt,
            execution_outcomes.tokens_burnt,
            action_receipt_actions.action_kind, action_receipt_actions.args,
            execution_outcome_receipts.produced_receipt_id
          FROM receipts
          LEFT JOIN execution_outcomes ON execution_outcomes.receipt_id = receipts.receipt_id
          LEFT JOIN action_receipt_actions ON action_receipt_actions.receipt_id = receipts.receipt_id
          LEFT JOIN execution_outcome_receipts ON execution_outcome_receipts.executed_receipt_id = receipts.receipt_id
          WHERE receipts.included_in_block_hash = :blockHash`,
          {
            blockHash,
          },
        ]);
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
}
