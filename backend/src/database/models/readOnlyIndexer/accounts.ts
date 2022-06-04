// @generated
// Automatically generated. Don't change this file manually.

import { ReceiptsId } from "./receipts";

export type AccountsId = string & { " __flavor"?: "accounts" };

export default interface Accounts {
  /** Primary key. Index: accounts_pkey */
  id: AccountsId;

  /** Index: accounts_account_id_key */
  account_id: string;

  created_by_receipt_id: ReceiptsId | null;

  deleted_by_receipt_id: ReceiptsId | null;

  /** Index: accounts_last_update_block_height_idx */
  last_update_block_height: string;
}

export interface AccountsInitializer {
  /**
   * Default value: nextval('accounts_id_seq'::regclass)
   * Primary key. Index: accounts_pkey
   */
  id?: AccountsId;

  /** Index: accounts_account_id_key */
  account_id: string;

  created_by_receipt_id?: ReceiptsId | null;

  deleted_by_receipt_id?: ReceiptsId | null;

  /** Index: accounts_last_update_block_height_idx */
  last_update_block_height: string;
}
