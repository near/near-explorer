import { call } from "../../api";

const Transactions = {
  getLatestTransactionsInfo: async () => {
    try {
      const transactions = await call(".select", [
        `SELECT transactions.hash, transactions.signer_id as signerId, transactions.receiver_id as receiverId, transactions.actions, blocks.timestamp as blockTimestamp
          FROM transactions
          LEFT JOIN blocks ON blocks.hash = transactions.block_hash
          ORDER BY blocks.height DESC
          LIMIT 10`
      ]);
      transactions.forEach(transaction => {
        try {
          transaction.actions = JSON.parse(transaction.actions);
        } catch {}
      });
      return transactions;
    } catch (error) {
      console.error(
        "Transactions.getTransactionsInfo failed to fetch data due to:"
      );
      console.error(error);
      throw error;
    }
  }
};

export default Transactions;
