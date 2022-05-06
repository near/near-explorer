// @generated
// Automatically generated. Don't change this file manually.

export type DailyGasUsedId = Date & { " __flavor"?: "daily_gas_used" };

export default interface DailyGasUsed {
  /** Primary key. Index: daily_gas_used_pkey */
  collected_for_day: DailyGasUsedId;

  gas_used: string;
}

export interface DailyGasUsedInitializer {
  /** Primary key. Index: daily_gas_used_pkey */
  collected_for_day: DailyGasUsedId;

  gas_used: string;
}
