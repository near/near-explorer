// @generated
// Automatically generated. Don't change this file manually.

import { ReceiptsId } from "./receipts";

export type DataReceiptsId = string & { " __flavor"?: "data_receipts" };

export default interface DataReceipts {
  /** Primary key. Index: receipt_data_pkey */
  data_id: DataReceiptsId;

  /** Index: data_receipts_receipt_id_idx */
  receipt_id: ReceiptsId;

  data: Buffer | null;
}

export interface DataReceiptsInitializer {
  /** Primary key. Index: receipt_data_pkey */
  data_id: DataReceiptsId;

  /** Index: data_receipts_receipt_id_idx */
  receipt_id: ReceiptsId;

  data?: Buffer | null;
}
