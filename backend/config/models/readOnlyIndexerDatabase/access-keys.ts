// @generated
// Automatically generated. Don't change this file manually.

import { ReceiptsId } from "./receipts";
import AccessKeyPermissionKind from "./access-key-permission-kind";

export default interface AccessKeys {
  /**
   * Primary key. Index: access_keys_pk
   * Index: access_keys_public_key_idx
   */
  public_key: string;

  /**
   * Index: access_keys_account_id_idx
   * Primary key. Index: access_keys_pk
   */
  account_id: string;

  created_by_receipt_id: ReceiptsId | null;

  deleted_by_receipt_id: ReceiptsId | null;

  permission_kind: AccessKeyPermissionKind;

  /** Index: access_keys_last_update_block_height_idx */
  last_update_block_height: string;
}

export interface AccessKeysInitializer {
  /**
   * Primary key. Index: access_keys_pk
   * Index: access_keys_public_key_idx
   */
  public_key: string;

  /**
   * Index: access_keys_account_id_idx
   * Primary key. Index: access_keys_pk
   */
  account_id: string;

  created_by_receipt_id?: ReceiptsId | null;

  deleted_by_receipt_id?: ReceiptsId | null;

  permission_kind: AccessKeyPermissionKind;

  /** Index: access_keys_last_update_block_height_idx */
  last_update_block_height: string;
}
