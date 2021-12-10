import { ExplorerApi } from ".";
import { Action } from "./transactions";

export interface Receipt {
  actions: Action[];
  blockTimestamp: number;
  receiptId: string;
  gasBurnt: number;
  receiverId: string;
  signerId: string;
  status?: ReceiptExecutionStatus;
  originatedFromTransactionHash?: string | null;
  tokensBurnt: string;
}

export type ReceiptExecutionStatus =
  | "Unknown"
  | "Failure"
  | "SuccessValue"
  | "SuccessReceiptId";

// from the search side 'originatedFromTransactionHash'
// can't be null
interface TransactionHashByReceiptId {
  receiptId: string;
  originatedFromTransactionHash: string;
}

export default class ReceiptsApi extends ExplorerApi {
  async queryReceiptsList(blockHash: string): Promise<Receipt[]> {
    return await this.call<Receipt[]>("receipts-list-by-block-hash", [
      blockHash,
    ]);
  }

  async queryReceiptsCountInBlock(blockHash: string): Promise<number> {
    let receiptsCount;
    try {
      receiptsCount = await this.call<number>("receipts-count-in-block", [
        blockHash,
      ]);
    } catch (error) {
      console.error(
        "ReceiptsApi.queryReceiptsCountInBlock failed to fetch data due to:"
      );
      console.error(error);
      throw error;
    }
    if (receiptsCount === undefined) {
      throw new Error(
        `ReceiptsApi.queryReceiptsCountInBlock: failed to fetch receiptsCount in block '${blockHash}'`
      );
    }
    return receiptsCount;
  }

  async getReceiptInTransaction(
    receiptId: string
  ): Promise<TransactionHashByReceiptId> {
    return await this.call<TransactionHashByReceiptId>(
      "transaction-hash-by-receipt-id",
      [receiptId]
    );
  }
}
