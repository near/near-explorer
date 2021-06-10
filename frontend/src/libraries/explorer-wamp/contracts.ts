import { DATA_SOURCE_TYPE } from "../consts";

import { ExplorerApi } from ".";

interface ContractInfo {
  transactionHash?: string;
  timestamp?: number;
  accessKeys: Array<object>;
  codeHash: string;
}

type Contract = ContractInfo | undefined;

export default class ContractsApi extends ExplorerApi {
  async getContractInfo(id: string): Promise<Contract> {
    const queryContractInfo = async () => {
      if (this.dataSource === DATA_SOURCE_TYPE.LEGACY_SYNC_BACKEND) {
        return await this.call<any>("select", [
          `SELECT
              transactions.block_timestamp,
              transactions.hash
            FROM transactions
            LEFT JOIN actions ON actions.transaction_hash = transactions.hash
            WHERE actions.action_type = "DeployContract" AND transactions.receiver_id = :id
            ORDER BY transactions.block_timestamp DESC
            LIMIT 1`,
          {
            id,
          },
        ]).then((info) => info[0]);
      } else if (this.dataSource === DATA_SOURCE_TYPE.INDEXER_BACKEND) {
        return await this.call<any>("select:INDEXER_BACKEND", [
          `SELECT
            DIV(receipts.included_in_block_timestamp, 1000*1000) AS block_timestamp,
            receipts.originated_from_transaction_hash AS hash
          FROM action_receipt_actions
          LEFT JOIN receipts ON receipts.receipt_id = action_receipt_actions.receipt_id
          WHERE action_receipt_actions.action_kind = 'DEPLOY_CONTRACT' AND action_receipt_actions.receipt_receiver_account_id = :id
          ORDER BY action_receipt_actions.receipt_included_in_block_timestamp DESC
          LIMIT 1`,
          {
            id,
          },
        ]).then((info) => {
          if (info.length === 0) {
            return undefined;
          }
          return {
            block_timestamp: parseInt(info[0].block_timestamp),
            hash: info[0].hash,
          };
        });
      } else {
        throw Error(`unsupported data source ${this.dataSource}`);
      }
    };

    try {
      // codeHash does not exist for deleted accounts
      const codeHash = await this.queryCodeHash(id).catch(() => {});
      if (codeHash && codeHash !== "11111111111111111111111111111111") {
        const [contractInfo, accessKeys] = await Promise.all([
          queryContractInfo(),
          this.queryAccessKey(id),
        ]);
        if (contractInfo !== undefined) {
          return {
            codeHash,
            transactionHash: contractInfo.hash,
            timestamp: contractInfo.block_timestamp,
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
        "ContractsApi.getContractInfo failed to fetch data due to:"
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
