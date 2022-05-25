// @generated
// Automatically generated. Don't change this file manually.

export type DailyActiveContractsCountId = Date & {
  " __flavor"?: "daily_active_contracts_count";
};

export default interface DailyActiveContractsCount {
  /** Primary key. Index: daily_active_contracts_count_pkey */
  collected_for_day: DailyActiveContractsCountId;

  active_contracts_count: number;
}

export interface DailyActiveContractsCountInitializer {
  /** Primary key. Index: daily_active_contracts_count_pkey */
  collected_for_day: DailyActiveContractsCountId;

  active_contracts_count: number;
}
