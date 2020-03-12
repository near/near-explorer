import { ExplorerApi } from ".";

export interface NodeInfo {
  ipAddress: string;
  moniker: string;
  accountId: string;
  nodeId: string;
  lastSeen: number;
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
  async getNodes(limit: number = 15) {
    try {
      return await this.call<NodeInfo[]>("select", [
        `SELECT ip_address as ipAddress, moniker, account_id as accountId, node_id as nodeId, signature, 
                last_seen as lastSeen, last_height as lastHeight, last_hash as lastHash,
                agent_name as agentName, agent_version as agentVersion, agent_build as agentBuild,
                peer_count as peerCount, is_validator as isValidator
                    FROM nodes
                    ORDER BY lastSeen DESC
                    Limit :limit`,
        {
          limit
        }
      ]);
    } catch (error) {
      console.error("Nodes.getNodes failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }
}
