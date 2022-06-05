// @generated
// Automatically generated. Don't change this file manually.

export type DailyActiveAccountsCountId = Date & {
  " __flavor"?: "daily_active_accounts_count";
};

export default interface DailyActiveAccountsCount {
  /** Primary key. Index: daily_active_accounts_count_pkey */
  collected_for_day: DailyActiveAccountsCountId;

  active_accounts_count: number;
}

export interface DailyActiveAccountsCountInitializer {
  /** Primary key. Index: daily_active_accounts_count_pkey */
  collected_for_day: DailyActiveAccountsCountId;

  active_accounts_count: number;
}
