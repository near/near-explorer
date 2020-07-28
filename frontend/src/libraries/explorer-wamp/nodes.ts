import { ExplorerApi } from ".";

export interface NodeInfo {
  ipAddress: string;
  accountId: string;
  nodeId: string;
  lastSeen: number;
  lastHeight: number;
  agentName: string;
  agentVersion: string;
  agentBuild: string;
  status: string;
}

export interface Validating {
  account_id: string;
  is_slashed?: string;
  num_produced_blocks?: number;
  num_expected_blocks?: number;
  public_key: string;
  stake: string;
  new?: boolean;
  removed?: boolean;
  shards: [];
  nodeInfo?: NodeInfo;
}

export interface NodeStats {
  validatorsCount: number;
  onlineNodesCount: number;
  proposalsCount: number;
}

export interface Proposal {
  account_id: string;
  public_key: string;
  stake: string;
}

export default class NodesApi extends ExplorerApi {
  async getOnlineNodes() {
    try {
      let nodes = await this.call<NodeInfo[]>("select", [
        `SELECT ip_address as ipAddress, account_id as accountId, node_id as nodeId, 
          last_seen as lastSeen, last_height as lastHeight,status,
          agent_name as agentName, agent_version as agentVersion, agent_build as agentBuild
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
        `SELECT ip_address as ipAddress, account_id as accountId, node_id as nodeId, 
        last_seen as lastSeen, last_height as lastHeight,status,
        agent_name as agentName, agent_version as agentVersion, agent_build as agentBuild
              FROM nodes
              WHERE account_id = :account_id
              ORDER BY node_id DESC
          `,
        {
          account_id,
        },
      ]).then((it) => it[0]);
    } catch (error) {
      console.error("Nodes.nodeInfo failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }

  async queryNodeRpc(): Promise<any> {
    return await this.call<any>("nearcore-validators");
  }
}
