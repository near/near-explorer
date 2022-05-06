// @generated
// Automatically generated. Don't change this file manually.

export default interface DailyReceiptsPerContractCount {
  /**
   * Index: daily_receipts_per_contract_count_idx
   * Primary key. Index: daily_receipts_per_contract_count_pk
   */
  collected_for_day: Date;

  /** Primary key. Index: daily_receipts_per_contract_count_pk */
  contract_id: string;

  /** Index: daily_receipts_per_contract_count_idx */
  receipts_count: string;
}

export interface DailyReceiptsPerContractCountInitializer {
  /**
   * Index: daily_receipts_per_contract_count_idx
   * Primary key. Index: daily_receipts_per_contract_count_pk
   */
  collected_for_day: Date;

  /** Primary key. Index: daily_receipts_per_contract_count_pk */
  contract_id: string;

  /** Index: daily_receipts_per_contract_count_idx */
  receipts_count: string;
}
