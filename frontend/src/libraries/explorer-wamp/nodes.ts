import { ExplorerApi } from ".";

export interface NodeInfo {
  ipAddress: string;
  moniker: string;
  accountId: string;
  nodeId: string;
  timestamp: number;
  lastHeight: number;
  lastHash: string | null;
  signature: string | null;
  agentName: string | null;
  agentVersion: string | null;
  agentBuild: string | null;
  peerCount: string | null;
  isValidator: boolean | null;
}

export default class NodesApi extends ExplorerApi {
  async getNodes(limit: number = 15, endTimestamp?: number) {
    try {
      return await this.call<NodeInfo[]>("select", [
        `SELECT ip_address as ipAddress, moniker, account_id as accountId, node_id as nodeId, signature, 
                last_seen as timestamp, last_height as lastHeight, last_hash as lastHash,
                agent_name as agentName, agent_version as agentVersion, agent_build as agentBuild,
                peer_count as peerCount, is_validator as isValidator
                    FROM nodes
                    ${endTimestamp ? `WHERE last_seen < :endTimestamp` : ""}
                    ORDER BY last_seen DESC
                    Limit :limit`,
        {
          limit,
          endTimestamp
        }
      ]);
    } catch (error) {
      console.error("Nodes.getNodes failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }
}
