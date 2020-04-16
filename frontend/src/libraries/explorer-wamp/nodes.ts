import { ExplorerApi } from ".";

export interface NodeInfo {
  ipAddress: string;
  moniker: string;
  accountId: string;
  nodeId: string;
  lastSeen: number;
  lastHeight: number;
  lastHash: string;
  signature: string;
  agentName: string;
  agentVersion: string;
  agentBuild: string;
  peerCount: string;
  isValidator: boolean;
  status: string;
}

export default class NodesApi extends ExplorerApi {
  async getNodes(limit: number = 15, endTimestamp?: number) {
    try {
      return await this.call<NodeInfo[]>("select", [
        `SELECT ip_address as ipAddress, moniker, account_id as accountId, node_id as nodeId, signature, 
                last_seen as lastSeen, last_height as lastHeight, last_hash as lastHash,
                agent_name as agentName, agent_version as agentVersion, agent_build as agentBuild,
                peer_count as peerCount, is_validator as isValidator, status
                    FROM nodes
                    ${endTimestamp ? `WHERE last_seen < :endTimestamp` : ""}
                    ORDER BY is_validator, last_seen DESC
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

  async getTotalValidators() {
    try {
      return await this.call("select", [
        `SELECT COUNT(*) as total from nodes
            WHERE is_validator = 1
        `
      ]).then((it: any) => it[0].total);
    } catch (error) {
      console.error("Nodes.getTotalValidators failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }
}
