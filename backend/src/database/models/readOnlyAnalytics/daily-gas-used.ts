// @generated
// This file is automatically generated by Kanel. Do not modify manually.

/** Identifier type for public.daily_gas_used */
export type DailyGasUsedCollectedForDay = Date & {
  __flavor?: "DailyGasUsedCollectedForDay";
};

/** Represents the table public.daily_gas_used */
export default interface DailyGasUsed {
  collected_for_day: DailyGasUsedCollectedForDay;

  gas_used: string;
}

/** Represents the initializer for the table public.daily_gas_used */
export interface DailyGasUsedInitializer {
  collected_for_day: DailyGasUsedCollectedForDay;

  gas_used: string;
}

/** Represents the mutator for the table public.daily_gas_used */
export interface DailyGasUsedMutator {
  collected_for_day?: DailyGasUsedCollectedForDay;

  gas_used?: string;
}
