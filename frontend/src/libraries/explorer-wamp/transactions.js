import { call } from ".";

export async function getTransactions(props) {
  const { signerId, receiverId } = props || {};
  const whereClause = [];
  if (signerId) {
    whereClause.push(`signerId = :signerId`);
  }
  if (receiverId) {
    whereClause.push(`receiverId = :receiverId`);
  }
  try {
    const transactions = await call(".select", [
      `SELECT transactions.hash, transactions.signer_id as signerId, transactions.receiver_id as receiverId, transactions.actions, blocks.timestamp as blockTimestamp
        FROM transactions
        LEFT JOIN blocks ON blocks.hash = transactions.block_hash
        ${whereClause.length > 0 ? `WHERE ${whereClause.join(" OR ")}` : ""}
        ORDER BY blocks.height DESC
        LIMIT 10`,
      props
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

export async function getLatestTransactionsInfo() {
  return getTransactions();
}
