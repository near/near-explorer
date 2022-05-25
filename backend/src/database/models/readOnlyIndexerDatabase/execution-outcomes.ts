// @generated
// Automatically generated. Don't change this file manually.

import { ReceiptsId } from "./receipts";
import { BlocksId } from "./blocks";
import ExecutionOutcomeStatus from "./execution-outcome-status";

export type ExecutionOutcomesId = string & {
  " __flavor"?: "execution_outcomes";
};

export default interface ExecutionOutcomes {
  /** Primary key. Index: execution_outcomes_pkey */
  receipt_id: ExecutionOutcomesId;

  /** Index: execution_outcomes_block_hash_idx */
  executed_in_block_hash: BlocksId;

  /** Index: execution_outcome_executed_in_block_timestamp */
  executed_in_block_timestamp: string;

  index_in_chunk: number;

  gas_burnt: string;

  tokens_burnt: string;

  executor_account_id: string;

  /** Index: execution_outcomes_status_idx */
  status: ExecutionOutcomeStatus;

  shard_id: string;
}

export interface ExecutionOutcomesInitializer {
  /** Primary key. Index: execution_outcomes_pkey */
  receipt_id: ExecutionOutcomesId;

  /** Index: execution_outcomes_block_hash_idx */
  executed_in_block_hash: BlocksId;

  /** Index: execution_outcome_executed_in_block_timestamp */
  executed_in_block_timestamp: string;

  index_in_chunk: number;

  gas_burnt: string;

  tokens_burnt: string;

  executor_account_id: string;

  /** Index: execution_outcomes_status_idx */
  status: ExecutionOutcomeStatus;

  shard_id: string;
}
