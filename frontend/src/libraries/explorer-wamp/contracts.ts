import { ExplorerApi } from ".";

export interface ContractInfo {
  transactionHash?: string;
  timestamp: number | null;
  accessKeys: Array<object>;
}

export default class ContractsApi extends ExplorerApi {
  async getContractInfo(id: string) {
    try {
      const codeHash = await this.queryCodeHash(id);
      if (codeHash !== "11111111111111111111111111111111") {
        const [contractInfo, accessKeys] = await Promise.all([
          this.call<any>("select", [
            `SELECT transactions.block_timestamp, transactions.hash 
            from transactions
            LEFT JOIN actions ON actions.transaction_hash = transactions.hash
            WHERE actions.action_type = "DeployContract" AND transactions.receiver_id = :id
            ORDER BY  transactions.block_timestamp DESC
            LIMIT 1`,
            {
              id
            }
          ]).then(info => info[0]),
          this.queryAccessKey(id)
        ]);
        return {
          transactionHash: contractInfo.hash,
          timestamp: contractInfo.block_timestamp,
          accessKeys: accessKeys.keys
        };
      } else {
        return;
      }
    } catch (error) {
      console.error(
        "ContractsApi.getContractInfo failed to fetch data due to:"
      );
      console.error(error);
      throw error;
    }
  }

  async queryCodeHash(id: string) {
    const account = await this.call<any>("nearcore-query", [
      `account/${id}`,
      ""
    ]);
    return account["code_hash"];
  }

  async queryAccessKey(id: string) {
    return await this.call<any>("nearcore-query", [`access_key/${id}`, ""]);
  }
}
