// @generated
// This file is automatically generated by Kanel. Do not modify manually.

/** Identifier type for public.daily_active_accounts_count */
export type DailyActiveAccountsCountCollectedForDay = Date & {
  __flavor?: "DailyActiveAccountsCountCollectedForDay";
};

/** Represents the table public.daily_active_accounts_count */
export default interface DailyActiveAccountsCount {
  collected_for_day: DailyActiveAccountsCountCollectedForDay;

  active_accounts_count: number;
}

/** Represents the initializer for the table public.daily_active_accounts_count */
export interface DailyActiveAccountsCountInitializer {
  collected_for_day: DailyActiveAccountsCountCollectedForDay;

  active_accounts_count: number;
}

/** Represents the mutator for the table public.daily_active_accounts_count */
export interface DailyActiveAccountsCountMutator {
  collected_for_day?: DailyActiveAccountsCountCollectedForDay;

  active_accounts_count?: number;
}
