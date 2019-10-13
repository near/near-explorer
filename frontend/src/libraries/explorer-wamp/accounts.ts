import { call } from ".";

interface AccountId {
  id: string;
}

interface AccountStats {
  inTransactionsCount: number;
  outTransactionsCount: number;
}

interface AccountInfo {
  amount: string;
  staked: string;
  storageUsage: number;
  storagePaidAt: number;
}

export type Account = AccountId & AccountStats & AccountInfo;

export async function getAccountInfo(id: string): Promise<Account> {
  try {
    const [accountInfo, accountStats] = await Promise.all([
      call<any>(".nearcore-query", [`account/${id}`, ""]),
      call<AccountStats[]>(".select", [
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

    return {
      id,
      amount: accountInfo.amount,
      staked: accountInfo.staked,
      storageUsage: accountInfo.storage_usage,
      storagePaidAt: accountInfo.storage_paid_at,
      ...accountStats[0]
    };
  } catch (error) {
    console.error("Accounts.getAccountInfo failed to fetch data due to:");
    console.error(error);
    throw error;
  }
}
