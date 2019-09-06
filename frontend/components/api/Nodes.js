import { call } from "../../api";

const Nodes = {
  getNodesInfo: async () => {
    try {
      return await call(".select", [
        `SELECT ip_address, moniker, account_id, node_id, last_seen, last_height FROM nodes ORDER BY last_seen DESC`
      ]);
    } catch (error) {
      console.error("Nodes.getNodesInfo[] failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }
};

export default Nodes;
