// @generated
// Automatically generated. Don't change this file manually.

export type DailyNewAccountsCountId = Date & {
  " __flavor"?: "daily_new_accounts_count";
};

export default interface DailyNewAccountsCount {
  /** Primary key. Index: daily_new_accounts_count_pkey */
  collected_for_day: DailyNewAccountsCountId;

  new_accounts_count: number;
}

export interface DailyNewAccountsCountInitializer {
  /** Primary key. Index: daily_new_accounts_count_pkey */
  collected_for_day: DailyNewAccountsCountId;

  new_accounts_count: number;
}
