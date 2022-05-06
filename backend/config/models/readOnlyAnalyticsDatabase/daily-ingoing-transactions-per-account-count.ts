// @generated
// Automatically generated. Don't change this file manually.

export default interface DailyIngoingTransactionsPerAccountCount {
  /**
   * Index: daily_ingoing_transactions_chart_idx
   * Primary key. Index: daily_ingoing_transactions_per_account_count_pk
   */
  collected_for_day: Date;

  /**
   * Index: daily_ingoing_transactions_per_account_count_idx
   * Primary key. Index: daily_ingoing_transactions_per_account_count_pk
   */
  account_id: string;

  /**
   * Index: daily_ingoing_transactions_chart_idx
   * Index: daily_ingoing_transactions_per_account_count_idx
   */
  ingoing_transactions_count: string;
}

export interface DailyIngoingTransactionsPerAccountCountInitializer {
  /**
   * Index: daily_ingoing_transactions_chart_idx
   * Primary key. Index: daily_ingoing_transactions_per_account_count_pk
   */
  collected_for_day: Date;

  /**
   * Index: daily_ingoing_transactions_per_account_count_idx
   * Primary key. Index: daily_ingoing_transactions_per_account_count_pk
   */
  account_id: string;

  /**
   * Index: daily_ingoing_transactions_chart_idx
   * Index: daily_ingoing_transactions_per_account_count_idx
   */
  ingoing_transactions_count: string;
}
