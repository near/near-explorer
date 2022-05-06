// @generated
// Automatically generated. Don't change this file manually.

export type DailyDeletedAccountsCountId = Date & {
  " __flavor"?: "daily_deleted_accounts_count";
};

export default interface DailyDeletedAccountsCount {
  /** Primary key. Index: daily_deleted_accounts_count_pkey */
  collected_for_day: DailyDeletedAccountsCountId;

  deleted_accounts_count: number;
}

export interface DailyDeletedAccountsCountInitializer {
  /** Primary key. Index: daily_deleted_accounts_count_pkey */
  collected_for_day: DailyDeletedAccountsCountId;

  deleted_accounts_count: number;
}
