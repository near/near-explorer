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

export interface NodeStats {
  validatorsCount: number;
  onlineNodesCount: number;
}

export default class NodesApi extends ExplorerApi {
  async getOnlineNodes() {
    try {
      let nodes = await this.call<NodeInfo[]>("select", [
        `SELECT ip_address as ipAddress, moniker, account_id as accountId, node_id as nodeId, signature, 
          last_seen as lastSeen, last_height as lastHeight, last_hash as lastHash,
          agent_name as agentName, agent_version as agentVersion, agent_build as agentBuild,
          peer_count as peerCount, is_validator as isValidator, status
              FROM nodes
             WHERE last_seen > (strftime('%s','now') - 60) * 1000
              ORDER BY is_validator ASC, node_id DESC
          `,
      ]);
      return nodes as NodeInfo[];
    } catch (error) {
      console.error("Nodes.getNodes failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }

  async getValidatingInfo(account_id: string) {
    try {
      return await this.call<NodeInfo[]>("select", [
        `SELECT ip_address as ipAddress, moniker, account_id as accountId, node_id as nodeId, signature, 
          last_seen as lastSeen, last_height as lastHeight, last_hash as lastHash,
          agent_name as agentName, agent_version as agentVersion, agent_build as agentBuild,
          peer_count as peerCount, is_validator as isValidator, status
              FROM nodes
              WHERE account_id = :account_id
              ORDER BY node_id DESC
          `,
        {
          account_id,
        },
      ]).then((it) => it[0]);
    } catch (error) {
      console.error("Nodes.getNodes failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }

  async getOnlineNodesStats() {
    try {
      const [onlineNodesCount, validators] = await Promise.all([
        this.call("select", [
          `SELECT COUNT(*) as onlineNodesCount FROM nodes
          WHERE last_seen > (strftime('%s','now') - 60) * 1000`,
        ]).then((it: any) => it[0].onlineNodesCount),
        this.queryValidators(),
      ]);
      const validatorsCount = validators.length;
      return { onlineNodesCount, validatorsCount } as NodeStats;
    } catch (error) {
      console.error("Nodes.getOnlineNodesStats failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }

  async queryValidators(): Promise<any> {
    const validators = await this.call<any>("nearcore-validators");
    return validators.current_validators;
  }
}
