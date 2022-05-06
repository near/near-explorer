// @generated
// Automatically generated. Don't change this file manually.

export default interface DailyTransactionCountByGasBurntRanges {
  /** Primary key. Index: daily_transaction_count_by_gas_burnt_ranges_pk */
  collected_for_day: Date;

  /** Primary key. Index: daily_transaction_count_by_gas_burnt_ranges_pk */
  top_of_range_in_teragas: number;

  transactions_count: string;
}

export interface DailyTransactionCountByGasBurntRangesInitializer {
  /** Primary key. Index: daily_transaction_count_by_gas_burnt_ranges_pk */
  collected_for_day: Date;

  /** Primary key. Index: daily_transaction_count_by_gas_burnt_ranges_pk */
  top_of_range_in_teragas: number;

  transactions_count: string;
}
