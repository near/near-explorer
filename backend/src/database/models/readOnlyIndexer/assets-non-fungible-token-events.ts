// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type NftEventKind from "./nft-event-kind";
import type { ReceiptsReceiptId } from "./receipts";

/** Identifier type for public.assets__non_fungible_token_events */
export type AssetsNonFungibleTokenEventsEmittedIndexOfEventEntryInShard =
  number & {
    __flavor?: "AssetsNonFungibleTokenEventsEmittedIndexOfEventEntryInShard";
  };

/** Represents the table public.assets__non_fungible_token_events */
export default interface AssetsNonFungibleTokenEvents {
  emitted_for_receipt_id: ReceiptsReceiptId;

  emitted_index_of_event_entry_in_shard: AssetsNonFungibleTokenEventsEmittedIndexOfEventEntryInShard;

  emitted_at_block_timestamp: string;

  emitted_in_shard_id: string;

  emitted_by_contract_account_id: string;

  token_id: string;

  event_kind: NftEventKind;

  token_old_owner_account_id: string;

  token_new_owner_account_id: string;

  token_authorized_account_id: string;

  event_memo: string;
}

/** Represents the initializer for the table public.assets__non_fungible_token_events */
export interface AssetsNonFungibleTokenEventsInitializer {
  emitted_for_receipt_id: ReceiptsReceiptId;

  emitted_index_of_event_entry_in_shard: AssetsNonFungibleTokenEventsEmittedIndexOfEventEntryInShard;

  emitted_at_block_timestamp: string;

  emitted_in_shard_id: string;

  emitted_by_contract_account_id: string;

  token_id: string;

  event_kind: NftEventKind;

  /** Default value: ''::text */
  token_old_owner_account_id?: string;

  /** Default value: ''::text */
  token_new_owner_account_id?: string;

  /** Default value: ''::text */
  token_authorized_account_id?: string;

  /** Default value: ''::text */
  event_memo?: string;
}

/** Represents the mutator for the table public.assets__non_fungible_token_events */
export interface AssetsNonFungibleTokenEventsMutator {
  emitted_for_receipt_id?: ReceiptsReceiptId;

  emitted_index_of_event_entry_in_shard?: AssetsNonFungibleTokenEventsEmittedIndexOfEventEntryInShard;

  emitted_at_block_timestamp?: string;

  emitted_in_shard_id?: string;

  emitted_by_contract_account_id?: string;

  token_id?: string;

  event_kind?: NftEventKind;

  token_old_owner_account_id?: string;

  token_new_owner_account_id?: string;

  token_authorized_account_id?: string;

  event_memo?: string;
}
