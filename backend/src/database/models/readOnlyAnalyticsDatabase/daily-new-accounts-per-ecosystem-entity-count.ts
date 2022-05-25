// @generated
// Automatically generated. Don't change this file manually.

export default interface DailyNewAccountsPerEcosystemEntityCount {
  /** Primary key. Index: daily_new_accounts_per_ecosystem_entity_count_pk */
  collected_for_day: Date;

  /** Primary key. Index: daily_new_accounts_per_ecosystem_entity_count_pk */
  entity_id: string;

  new_accounts_count: string;
}

export interface DailyNewAccountsPerEcosystemEntityCountInitializer {
  /** Primary key. Index: daily_new_accounts_per_ecosystem_entity_count_pk */
  collected_for_day: Date;

  /** Primary key. Index: daily_new_accounts_per_ecosystem_entity_count_pk */
  entity_id: string;

  new_accounts_count: string;
}
