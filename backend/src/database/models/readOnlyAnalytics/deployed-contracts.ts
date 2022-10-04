// @generated
// Automatically generated. Don't change this file manually.

export type DeployedContractsId = string & {
  " __flavor"?: "deployed_contracts";
};

export default interface DeployedContracts {
  /** Index: deployed_contracts_sha256_idx */
  contract_code_sha256: string;

  /** Index: deployed_contracts_deployed_to_account_id_idx */
  deployed_to_account_id: string;

  /** Primary key. Index: deployed_contracts__pkey */
  deployed_by_receipt_id: DeployedContractsId;

  /** Index: deployed_contracts_timestamp_idx */
  deployed_at_block_timestamp: string;

  deployed_at_block_hash: string;
}

export interface DeployedContractsInitializer {
  /** Index: deployed_contracts_sha256_idx */
  contract_code_sha256: string;

  /** Index: deployed_contracts_deployed_to_account_id_idx */
  deployed_to_account_id: string;

  /** Primary key. Index: deployed_contracts__pkey */
  deployed_by_receipt_id: DeployedContractsId;

  /** Index: deployed_contracts_timestamp_idx */
  deployed_at_block_timestamp: string;

  /** Default value: ''::text */
  deployed_at_block_hash?: string;
}
