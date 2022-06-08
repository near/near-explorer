// @generated
// Automatically generated. Don't change this file manually.

export type DailyTransactionsCountId = Date & {
  " __flavor"?: "daily_transactions_count";
};

export default interface DailyTransactionsCount {
  /** Primary key. Index: daily_transactions_count_pkey */
  collected_for_day: DailyTransactionsCountId;

  transactions_count: string;
}

export interface DailyTransactionsCountInitializer {
  /** Primary key. Index: daily_transactions_count_pkey */
  collected_for_day: DailyTransactionsCountId;

  transactions_count: string;
}
