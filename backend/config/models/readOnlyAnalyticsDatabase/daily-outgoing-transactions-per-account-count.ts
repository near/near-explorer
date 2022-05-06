// @generated
// Automatically generated. Don't change this file manually.

export default interface DailyOutgoingTransactionsPerAccountCount {
  /**
   * Index: daily_outgoing_transactions_chart_idx
   * Primary key. Index: daily_outgoing_transactions_per_account_count_pk
   */
  collected_for_day: Date;

  /**
   * Index: daily_outgoing_transactions_per_account_count_idx
   * Primary key. Index: daily_outgoing_transactions_per_account_count_pk
   */
  account_id: string;

  /**
   * Index: daily_outgoing_transactions_chart_idx
   * Index: daily_outgoing_transactions_per_account_count_idx
   */
  outgoing_transactions_count: string;
}

export interface DailyOutgoingTransactionsPerAccountCountInitializer {
  /**
   * Index: daily_outgoing_transactions_chart_idx
   * Primary key. Index: daily_outgoing_transactions_per_account_count_pk
   */
  collected_for_day: Date;

  /**
   * Index: daily_outgoing_transactions_per_account_count_idx
   * Primary key. Index: daily_outgoing_transactions_per_account_count_pk
   */
  account_id: string;

  /**
   * Index: daily_outgoing_transactions_chart_idx
   * Index: daily_outgoing_transactions_per_account_count_idx
   */
  outgoing_transactions_count: string;
}
