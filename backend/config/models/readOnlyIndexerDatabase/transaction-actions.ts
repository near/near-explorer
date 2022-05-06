// @generated
// Automatically generated. Don't change this file manually.

import { TransactionsId } from "./transactions";
import ActionKind from "./action-kind";

export default interface TransactionActions {
  /** Primary key. Index: transaction_action_pk */
  transaction_hash: TransactionsId;

  /** Primary key. Index: transaction_action_pk */
  index_in_transaction: number;

  /** Index: transactions_actions_action_kind_idx */
  action_kind: ActionKind;

  args: Record<string, unknown>;
}

export interface TransactionActionsInitializer {
  /** Primary key. Index: transaction_action_pk */
  transaction_hash: TransactionsId;

  /** Primary key. Index: transaction_action_pk */
  index_in_transaction: number;

  /** Index: transactions_actions_action_kind_idx */
  action_kind: ActionKind;

  args: Record<string, unknown>;
}
