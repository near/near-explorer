// @generated
// Automatically generated. Don't change this file manually.

import { ExecutionOutcomesId } from "./execution-outcomes";

export default interface ExecutionOutcomeReceipts {
  /** Primary key. Index: execution_outcome_receipt_pk */
  executed_receipt_id: ExecutionOutcomesId;

  /** Primary key. Index: execution_outcome_receipt_pk */
  index_in_execution_outcome: number;

  /**
   * Primary key. Index: execution_outcome_receipt_pk
   * Index: execution_outcome_receipts_produced_receipt_id
   */
  produced_receipt_id: string;
}

export interface ExecutionOutcomeReceiptsInitializer {
  /** Primary key. Index: execution_outcome_receipt_pk */
  executed_receipt_id: ExecutionOutcomesId;

  /** Primary key. Index: execution_outcome_receipt_pk */
  index_in_execution_outcome: number;

  /**
   * Primary key. Index: execution_outcome_receipt_pk
   * Index: execution_outcome_receipts_produced_receipt_id
   */
  produced_receipt_id: string;
}
