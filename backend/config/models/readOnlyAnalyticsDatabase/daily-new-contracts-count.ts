// @generated
// Automatically generated. Don't change this file manually.

export type DailyNewContractsCountId = Date & {
  " __flavor"?: "daily_new_contracts_count";
};

export default interface DailyNewContractsCount {
  /** Primary key. Index: daily_new_contracts_count_pkey */
  collected_for_day: DailyNewContractsCountId;

  new_contracts_count: number;
}

export interface DailyNewContractsCountInitializer {
  /** Primary key. Index: daily_new_contracts_count_pkey */
  collected_for_day: DailyNewContractsCountId;

  new_contracts_count: number;
}
