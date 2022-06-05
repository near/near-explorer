// @generated
// Automatically generated. Don't change this file manually.

import { ReceiptsId } from "./receipts";

export type ActionReceiptsId = string & { " __flavor"?: "action_receipts" };

export default interface ActionReceipts {
  /** Primary key. Index: receipt_actions_pkey */
  receipt_id: ActionReceiptsId;

  /** Index: action_receipt_signer_account_id_idx */
  signer_account_id: string;

  signer_public_key: string;

  gas_price: string;
}

export interface ActionReceiptsInitializer {
  /** Primary key. Index: receipt_actions_pkey */
  receipt_id: ActionReceiptsId;

  /** Index: action_receipt_signer_account_id_idx */
  signer_account_id: string;

  signer_public_key: string;

  gas_price: string;
}
