import { ExplorerApi } from ".";

interface BaseContractInfo {
  blockTimestamp: number;
  hash: string;
}
interface ContractInfo {
  transactionHash?: string;
  timestamp?: number;
  accessKeys: Array<object>;
  codeHash: string;
}

type Contract = ContractInfo | undefined;

export default class ContractsApi extends ExplorerApi {
  async getContractInfoByAccountId(
    accountId: string
  ): Promise<BaseContractInfo> {
    return await this.call<BaseContractInfo>("contract-info-by-account-id", [
      accountId,
    ]);
  }

  async getExtendedContractInfo(id: string): Promise<Contract> {
    try {
      // codeHash does not exist for deleted accounts
      const codeHash = await this.queryCodeHash(id).catch(() => {});
      if (codeHash && codeHash !== "11111111111111111111111111111111") {
        const [contractInfo, accessKeys] = await Promise.all([
          this.getContractInfoByAccountId(id),
          this.queryAccessKey(id),
        ]);
        if (contractInfo !== undefined) {
          return {
            codeHash,
            transactionHash: contractInfo.hash,
            timestamp: contractInfo.blockTimestamp,
            accessKeys: accessKeys.keys,
          };
        } else {
          return {
            codeHash,
            accessKeys: accessKeys.keys,
          };
        }
      } else {
        return;
      }
    } catch (error) {
      console.error(
        "ContractsApi.getExtendedContractInfo failed to fetch data due to:"
      );
      console.error(error);
      throw error;
    }
  }

  async queryCodeHash(id: string) {
    const account = await this.call<any>("nearcore-view-account", [id]);
    return account["code_hash"];
  }

  async queryAccessKey(id: string) {
    return await this.call<any>("nearcore-view-access-key-list", [id]);
  }
}
