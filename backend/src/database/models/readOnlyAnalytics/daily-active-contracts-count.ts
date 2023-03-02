// @generated
// This file is automatically generated by Kanel. Do not modify manually.

/** Identifier type for public.daily_active_contracts_count */
export type DailyActiveContractsCountCollectedForDay = Date & {
  __flavor?: "DailyActiveContractsCountCollectedForDay";
};

/** Represents the table public.daily_active_contracts_count */
export default interface DailyActiveContractsCount {
  collected_for_day: DailyActiveContractsCountCollectedForDay;

  active_contracts_count: number;
}

/** Represents the initializer for the table public.daily_active_contracts_count */
export interface DailyActiveContractsCountInitializer {
  collected_for_day: DailyActiveContractsCountCollectedForDay;

  active_contracts_count: number;
}

/** Represents the mutator for the table public.daily_active_contracts_count */
export interface DailyActiveContractsCountMutator {
  collected_for_day?: DailyActiveContractsCountCollectedForDay;

  active_contracts_count?: number;
}
