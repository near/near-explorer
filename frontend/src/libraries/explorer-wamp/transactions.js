import { call } from ".";

export async function getTransactions(filters) {
  const { signerId, receiverId, transactionHash, blockHash } = filters;
  const whereClause = [];
  if (signerId) {
    whereClause.push(`transactions.signerId = :signerId`);
  }
  if (receiverId) {
    whereClause.push(`transactions.receiverId = :receiverId`);
  }
  if (transactionHash) {
    whereClause.push(`transactions.hash = :transactionHash`);
  }
  if (blockHash) {
    whereClause.push(`transactions.block_hash = :blockHash`);
  }
  if (!filters.limit) {
    filters.limit = 10;
  }
  try {
    const transactions = await call(".select", [
      `SELECT transactions.hash, transactions.signer_id as signerId, transactions.receiver_id as receiverId, transactions.actions, transactions.block_hash as blockHash, blocks.timestamp as blockTimestamp
        FROM transactions
        LEFT JOIN blocks ON blocks.hash = transactions.block_hash
        ${whereClause.length > 0 ? `WHERE ${whereClause.join(" OR ")}` : ""}
        ORDER BY blocks.height DESC
        LIMIT :limit`,
      filters
    ]);
    transactions.forEach(transaction => {
      transaction.status = "Completed";
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
