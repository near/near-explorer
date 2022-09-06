// @generated
// Automatically generated. Don't change this file manually.

export type NodesId = string & { " __flavor"?: "nodes" };

export default interface Nodes {
  ip_address: string;

  moniker: string;

  account_id: string;

  /** Primary key. Index: nodes_pkey */
  node_id: NodesId;

  /** Index: nodes_last_seen */
  last_seen: Date;

  last_height: string;

  agent_name: string;

  agent_version: string;

  agent_build: string;

  peer_count: string;

  /** Index: nodes_is_validator */
  is_validator: boolean;

  last_hash: string;

  signature: string;

  status: string;

  latitude: string | null;

  longitude: string | null;

  city: string | null;

  bandwidth_download: number | null;

  bandwidth_upload: number | null;

  cpu_usage: number | null;

  memory_usage: number | null;

  boot_time_seconds: Date | null;

  block_production_tracking_delay: number | null;

  min_block_production_delay: number | null;

  max_block_production_delay: number | null;

  max_block_wait_delay: number | null;
}

export interface NodesInitializer {
  ip_address: string;

  moniker: string;

  account_id: string;

  /** Primary key. Index: nodes_pkey */
  node_id: NodesId;

  /** Index: nodes_last_seen */
  last_seen: Date;

  last_height: string;

  agent_name: string;

  agent_version: string;

  agent_build: string;

  peer_count: string;

  /** Index: nodes_is_validator */
  is_validator: boolean;

  last_hash: string;

  signature: string;

  status: string;

  latitude?: string | null;

  longitude?: string | null;

  city?: string | null;
}
