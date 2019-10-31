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
