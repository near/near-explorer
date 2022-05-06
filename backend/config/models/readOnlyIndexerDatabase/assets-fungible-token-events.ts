// @generated
// Automatically generated. Don't change this file manually.

import { ReceiptsId } from "./receipts";
import FtEventKind from "./ft-event-kind";

export default interface AssetsFungibleTokenEvents {
  /**
   * Primary key. Index: assets__fungible_token_events_pkey
   * Index: assets__fungible_token_events_unique
   */
  emitted_for_receipt_id: ReceiptsId;

  /**
   * Index: assets__fungible_token_events_block_timestamp_idx
   * Primary key. Index: assets__fungible_token_events_pkey
   * Index: assets__fungible_token_events_sorting_idx
   */
  emitted_at_block_timestamp: string;

  /**
   * Primary key. Index: assets__fungible_token_events_pkey
   * Index: assets__fungible_token_events_sorting_idx
   */
  emitted_in_shard_id: string;

  /**
   * Primary key. Index: assets__fungible_token_events_pkey
   * Index: assets__fungible_token_events_sorting_idx
   * Index: assets__fungible_token_events_unique
   */
  emitted_index_of_event_entry_in_shard: number;

  /** Primary key. Index: assets__fungible_token_events_pkey */
  emitted_by_contract_account_id: string;

  /** Primary key. Index: assets__fungible_token_events_pkey */
  amount: string;

  /** Primary key. Index: assets__fungible_token_events_pkey */
  event_kind: FtEventKind;

  /**
   * Index: assets__fungible_token_events_old_owner_account_id_idx
   * Primary key. Index: assets__fungible_token_events_pkey
   */
  token_old_owner_account_id: string;

  /**
   * Index: assets__fungible_token_events_new_owner_account_id_idx
   * Primary key. Index: assets__fungible_token_events_pkey
   */
  token_new_owner_account_id: string;

  /** Primary key. Index: assets__fungible_token_events_pkey */
  event_memo: string;
}

export interface AssetsFungibleTokenEventsInitializer {
  /**
   * Primary key. Index: assets__fungible_token_events_pkey
   * Index: assets__fungible_token_events_unique
   */
  emitted_for_receipt_id: ReceiptsId;

  /**
   * Index: assets__fungible_token_events_block_timestamp_idx
   * Primary key. Index: assets__fungible_token_events_pkey
   * Index: assets__fungible_token_events_sorting_idx
   */
  emitted_at_block_timestamp: string;

  /**
   * Primary key. Index: assets__fungible_token_events_pkey
   * Index: assets__fungible_token_events_sorting_idx
   */
  emitted_in_shard_id: string;

  /**
   * Primary key. Index: assets__fungible_token_events_pkey
   * Index: assets__fungible_token_events_sorting_idx
   * Index: assets__fungible_token_events_unique
   */
  emitted_index_of_event_entry_in_shard: number;

  /** Primary key. Index: assets__fungible_token_events_pkey */
  emitted_by_contract_account_id: string;

  /** Primary key. Index: assets__fungible_token_events_pkey */
  amount: string;

  /** Primary key. Index: assets__fungible_token_events_pkey */
  event_kind: FtEventKind;

  /**
   * Default value: ''::text
   * Index: assets__fungible_token_events_old_owner_account_id_idx
   * Primary key. Index: assets__fungible_token_events_pkey
   */
  token_old_owner_account_id?: string;

  /**
   * Default value: ''::text
   * Index: assets__fungible_token_events_new_owner_account_id_idx
   * Primary key. Index: assets__fungible_token_events_pkey
   */
  token_new_owner_account_id?: string;

  /**
   * Default value: ''::text
   * Primary key. Index: assets__fungible_token_events_pkey
   */
  event_memo?: string;
}
