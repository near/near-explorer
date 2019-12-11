import { ExplorerApi } from ".";

export default class NodesApi extends ExplorerApi {
  async getNodesInfo() {
    try {
      return await this.call("select", [
        `SELECT ip_address as ipAddress, moniker, account_id as accountId, node_id as nodeId, last_seen as lastSeen, last_height as lastHeight
          FROM nodes
          ORDER BY lastSeen DESC`
      ]);
    } catch (error) {
      console.error("Nodes.getNodesInfo[] failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }
}

//TODO: new query for telemetry data
`SELECT agent_name as agentName, agent_version as agentVersion, agent_build as agentBuild, 
  ip_address as ipAddress, moniker, account_id as accountId, node_id as nodeId, signature 
  last_seen as lastSeen, last_height as lastHeight, last_hash as lastHash, peer_count as peerCount, is_validator as isValidator
    FROM nodes
    ORDER BY lastSeen DESC`;
