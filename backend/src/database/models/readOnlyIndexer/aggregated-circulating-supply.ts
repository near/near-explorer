// @generated
// Automatically generated. Don't change this file manually.

import { BlocksId } from "./blocks";

export type AggregatedCirculatingSupplyId = string & {
  " __flavor"?: "aggregated__circulating_supply";
};

export default interface AggregatedCirculatingSupply {
  /** Index: aggregated__circulating_supply_timestamp_idx */
  computed_at_block_timestamp: string;

  /** Primary key. Index: aggregated__circulating_supply_pkey */
  computed_at_block_hash: AggregatedCirculatingSupplyId;

  circulating_tokens_supply: string;

  total_tokens_supply: string;

  total_lockup_contracts_count: number;

  unfinished_lockup_contracts_count: number;

  foundation_locked_tokens: string;

  lockups_locked_tokens: string;
}

export interface AggregatedCirculatingSupplyInitializer {
  /** Index: aggregated__circulating_supply_timestamp_idx */
  computed_at_block_timestamp: string;

  /** Primary key. Index: aggregated__circulating_supply_pkey */
  computed_at_block_hash: AggregatedCirculatingSupplyId;

  circulating_tokens_supply: string;

  total_tokens_supply: string;

  total_lockup_contracts_count: number;

  unfinished_lockup_contracts_count: number;

  foundation_locked_tokens: string;

  lockups_locked_tokens: string;
}
