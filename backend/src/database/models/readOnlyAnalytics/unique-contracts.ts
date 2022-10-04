// @generated
// Automatically generated. Don't change this file manually.

export type UniqueContractsId = string & { " __flavor"?: "unique_contracts" };

export default interface UniqueContracts {
  /** Primary key. Index: unique_contracts_pkey */
  contract_code_sha256: UniqueContractsId;

  /** Index: unique_contracts_contract_sdk_type_idx */
  contract_sdk_type: string;

  /** Index: unique_contracts_first_deployed_to_account_id_idx */
  first_deployed_to_account_id: string;

  first_deployed_by_receipt_id: string;

  /** Index: unique_contracts_timestamp_idx */
  first_deployed_at_block_timestamp: string;

  first_deployed_at_block_hash: string;
}

export interface UniqueContractsInitializer {
  /** Primary key. Index: unique_contracts_pkey */
  contract_code_sha256: UniqueContractsId;

  /**
   * Default value: ''::text
   * Index: unique_contracts_contract_sdk_type_idx
   */
  contract_sdk_type?: string;

  /** Index: unique_contracts_first_deployed_to_account_id_idx */
  first_deployed_to_account_id: string;

  first_deployed_by_receipt_id: string;

  /** Index: unique_contracts_timestamp_idx */
  first_deployed_at_block_timestamp: string;

  first_deployed_at_block_hash: string;
}
