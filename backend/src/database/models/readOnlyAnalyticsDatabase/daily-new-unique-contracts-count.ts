// @generated
// Automatically generated. Don't change this file manually.

export type DailyNewUniqueContractsCountId = Date & {
  " __flavor"?: "daily_new_unique_contracts_count";
};

export default interface DailyNewUniqueContractsCount {
  /** Primary key. Index: daily_new_unique_contracts_count_pkey */
  collected_for_day: DailyNewUniqueContractsCountId;

  new_unique_contracts_count: number;
}

export interface DailyNewUniqueContractsCountInitializer {
  /** Primary key. Index: daily_new_unique_contracts_count_pkey */
  collected_for_day: DailyNewUniqueContractsCountId;

  new_unique_contracts_count: number;
}
