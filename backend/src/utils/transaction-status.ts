import { ExecutionOutcomeStatus } from "@/backend/database/models/readOnlyIndexer";
import * as RPC from "@/common/types/rpc";

export type TransactionStatus = "unknown" | "failure" | "success";

export const mapRpcTransactionStatus = (
  status: RPC.FinalExecutionStatus
): TransactionStatus => {
  if ("SuccessValue" in status) {
    return "success";
  }
  if ("Failure" in status) {
    return "failure";
  }
  return "unknown";
};

export const mapDatabaseTransactionStatus = (
  status: ExecutionOutcomeStatus
): TransactionStatus => {
  switch (status) {
    case "SUCCESS_VALUE":
    case "SUCCESS_RECEIPT_ID":
      return "success";
    case "FAILURE":
      return "failure";
    default:
      return "unknown";
  }
};
