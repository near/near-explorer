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
  nonValidatorsCount: number;
}

export default class NodesApi extends ExplorerApi {
  async getNodes(
    limit: number = 15,
    validatorIndicator: string = "validators",
    paginationIndexer?: number
  ) {
    let whereClause = `WHERE last_seen > (strftime('%s','now') - 60) * 1000 `;
    if (paginationIndexer) {
      whereClause += ` AND last_seen < :paginationIndexer`;
    }
    if (validatorIndicator === "validators") {
      whereClause += ` AND is_validator = 1 `;
    }
    if (validatorIndicator === "non-validators") {
      whereClause += ` AND is_validator = 0 `;
    }
    try {
      const nodes = await this.call<NodeInfo[]>("select", [
        `SELECT ip_address as ipAddress, moniker, account_id as accountId, node_id as nodeId, signature, 
        last_seen as lastSeen, last_height as lastHeight, last_hash as lastHash,
        agent_name as agentName, agent_version as agentVersion, agent_build as agentBuild,
        peer_count as peerCount, is_validator as isValidator, status
            FROM nodes
            ${whereClause}
            ORDER BY last_seen DESC
            LIMIT :limit
        `,
        {
          limit,
          paginationIndexer,
          validatorIndicator,
        },
      ]);
      return nodes as NodeInfo[];
    } catch (error) {
      console.error("Nodes.getNodes failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }

  async getOnlineNodesStats() {
    try {
      const nodeStats = await this.call("select", [
        `
          SELECT
            validators.validatorsCount,
            nonValidators.nonValidatorsCount
          FROM
          (SELECT COUNT(*) as validatorsCount FROM nodes
              WHERE is_validator = 1 AND last_seen > (strftime('%s','now') - 60) * 1000) as validators,
          (SELECT COUNT(*) as nonValidatorsCount FROM nodes
              WHERE is_validator = 0 AND last_seen > (strftime('%s','now') - 60) * 1000) as nonValidators
          `,
      ]).then((it: any) => it[0]);
      return { ...nodeStats } as NodeStats;
    } catch (error) {
      console.error("Nodes.getOnlineNodesStats failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }
}
