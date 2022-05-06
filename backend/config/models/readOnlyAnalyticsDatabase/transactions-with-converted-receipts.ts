// @generated
// Automatically generated. Don't change this file manually.

export default interface TransactionsWithConvertedReceipts {
  /**
   * Primary key. Index: transactions_with_converted_receipts_pkey
   * Index: transactions_with_converted_receipts_unique_idx
   */
  transaction_hash: string;

  /** Primary key. Index: transactions_with_converted_receipts_pkey */
  receipt_id: string;
}

export interface TransactionsWithConvertedReceiptsInitializer {
  /**
   * Primary key. Index: transactions_with_converted_receipts_pkey
   * Index: transactions_with_converted_receipts_unique_idx
   */
  transaction_hash: string;

  /** Primary key. Index: transactions_with_converted_receipts_pkey */
  receipt_id: string;
}
