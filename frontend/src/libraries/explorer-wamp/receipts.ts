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
    return await this.call<number>("receipts-count-in-block", [blockHash]);
  }

  async getTransactionHashByReceiptId(
    receiptId: string
  ): Promise<TransactionHashByReceiptId> {
    return await this.call<TransactionHashByReceiptId>(
      "transaction-hash-by-receipt-id",
      [receiptId]
    );
  }
}
