// @generated
// Automatically generated. Don't change this file manually.

export type DeployedContractsId = string & {
  " __flavor"?: "deployed_contracts";
};

export default interface DeployedContracts {
  /** Index: deployed_contracts_sha256_idx */
  contract_code_sha256: string;

  deployed_to_account_id: string;

  /** Primary key. Index: deployed_contracts_pkey */
  deployed_by_receipt_id: DeployedContractsId;

  /** Index: deployed_contracts_timestamp_idx */
  deployed_at_block_timestamp: string;
}

export interface DeployedContractsInitializer {
  /** Index: deployed_contracts_sha256_idx */
  contract_code_sha256: string;

  deployed_to_account_id: string;

  /** Primary key. Index: deployed_contracts_pkey */
  deployed_by_receipt_id: DeployedContractsId;

  /** Index: deployed_contracts_timestamp_idx */
  deployed_at_block_timestamp: string;
}
