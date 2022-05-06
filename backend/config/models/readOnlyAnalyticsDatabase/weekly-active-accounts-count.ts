// @generated
// Automatically generated. Don't change this file manually.

export type WeeklyActiveAccountsCountId = Date & {
  " __flavor"?: "weekly_active_accounts_count";
};

export default interface WeeklyActiveAccountsCount {
  /** Primary key. Index: weekly_active_accounts_count_pkey */
  collected_for_week: WeeklyActiveAccountsCountId;

  active_accounts_count: number;
}

export interface WeeklyActiveAccountsCountInitializer {
  /** Primary key. Index: weekly_active_accounts_count_pkey */
  collected_for_week: WeeklyActiveAccountsCountId;

  active_accounts_count: number;
}
