import { ExplorerApi } from ".";

export interface ContractInfo {
  id: string;
  transactionHash: string | null;
  timestamp: number | null;
  accessKeys: Array<object>;
}

export default class ContractsApi extends ExplorerApi {
  async getContractInfo(id: string): Promise<ContractInfo> {
    try {
      const [accessKey, contractStats] = await Promise.all([
        this.queryAccessKey(id),
        this.call<any>("select", [
          `SELECT transaction_hash as transactionHash, timestamp
                    from contracts
                    WHERE account_id = :id
                    ORDER BY timestamp DESC`,
          {
            id,
          },
        ]).then((contract) => contract[0] || null),
      ]);
      if (contractStats === null) {
        return {
          id,
          transactionHash: null,
          timestamp: null,
          accessKeys: [],
        };
      }
      return {
        id,
        transactionHash: contractStats.transactionHash,
        timestamp: contractStats.timestamp,
        accessKeys: accessKey.keys,
      };
    } catch (error) {
      console.error(
        "ContractsApi.getContractInfo failed to fetch data due to:"
      );
      console.error(error);
      throw error;
    }
  }

  async queryAccessKey(id: string) {
    return await this.call<any>("nearcore-query", [`access_key/${id}`, ""]);
  }
}
