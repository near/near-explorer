import { call } from ".";

const Accounts = {
  getAccountInfo: async id => {
    try {
      const [rpcAccountResponse, accountResponse] = await Promise.all([
        call(".nearcore-query", [`account/${id}`, ""]),
        call(".select", [
          `SELECT outTransactionsCount.outTransactionsCount, inTransactionsCount.inTransactionsCount FROM
            (SELECT COUNT(transactions.hash) as outTransactionsCount FROM transactions
              WHERE signer_id = :id) as outTransactionsCount,
            (SELECT COUNT(transactions.hash) as inTransactionsCount FROM transactions
              WHERE receiver_id = :id) as inTransactionsCount
          `,
          {
            id
          }
        ])
      ]);

      return { id, ...rpcAccountResponse, ...accountResponse[0] };
    } catch (error) {
      console.error("Accounts.getAccountInfo failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }
};

export default Accounts;
