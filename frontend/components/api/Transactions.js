import { call } from "../../api";

const processTransactions = transactions => {
  if (transactions === null || transactions === undefined) {
    return transactions;
  }

  for (let transaction of transactions) {
    let args;
    try {
      args = JSON.parse(transaction.args);
    } catch (err) {
      transaction.msg = `${transaction.kind}: ${transaction.args}`;
      continue;
    }

    switch (transaction.kind) {
      case "AddKey":
        transaction.msg = args.access_key
          ? `Access key for contract: "${args.access_key.contract_id}"`
          : `New Key Created: ${new_key}`;
        break;

      case "CreateAccount":
        transaction.msg = `New Account Created: @${
          args.new_account_id
        }, balance: ${args.amount}`;
        break;

      case "FunctionCall":
        transaction.msg = `Call: Called method in contract "${
          args.contract_id
        }"`;
        break;

      default:
        transaction.msg = `${transaction.kind}: ${JSON.stringify(
          transaction.args
        )}`;
    }
  }

  return transactions;
};

const Transactions = {
  getLatestTransactionsInfo: async () => {
    try {
      const transactions = await call(".select", [
        `SELECT transactions.hash, transactions.originator, transactions.kind, transactions.args, transactions.status, blocks.timestamp as blockTimestamp FROM transactions
          LEFT JOIN chunks ON chunks.hash = transactions.chunk_hash
          LEFT JOIN blocks ON blocks.hash = chunks.block_hash
          ORDER BY blocks.height DESC
          LIMIT 10`
      ]);

      return processTransactions(transactions);
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
