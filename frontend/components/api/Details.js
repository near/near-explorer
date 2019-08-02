import { call } from "../../api";

const Details = {
  getDetails: async () => {
    try {
      const details = await call(".select", [
        `SELECT accounts.accountsCount, nodes.totalNodesCount, online_nodes.onlineNodesCount, transactions.lastDayTxCount, last_block.lastBlockHeight FROM
          (SELECT COUNT(*) as accountsCount FROM accounts) as accounts,
          (SELECT COUNT(*) as totalNodesCount FROM nodes) as nodes,
          (SELECT COUNT(*) as onlineNodesCount FROM nodes WHERE last_seen > (strftime('%s','now') - 60) * 1000) as online_nodes,
          (
            SELECT COUNT(*) as lastDayTxCount FROM transactions
              LEFT JOIN chunks ON chunks.hash = transactions.chunk_hash
              LEFT JOIN blocks ON blocks.hash = chunks.block_hash
              WHERE blocks.timestamp > (strftime('%s','now') - 60 * 60 * 24) * 1000
          ) as transactions,
          (SELECT height as lastBlockHeight FROM blocks ORDER BY height DESC LIMIT 1) as last_block`
      ]);

      return {
        ...details[0],

        // TODO: expose this info from the backend:
        tpsMax: "?/?"
      };
    } catch (error) {
      console.error("Details.getDetails failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }
};

export default Details;
