import { ReceiptExecutionStatus } from "../../libraries/explorer-wamp/receipts";

const EXECUTION_RECEIPT_STATUSES: Record<ReceiptExecutionStatus, string> = {
  Unknown: "Unknown",
  Failure: "Failed",
  SuccessValue: "Succeeded",
  // The transaction execution status will be recursively deferred to the status of the receipt id,
  // but given we only care about the details when we display the whole transaction execution plan,
  // it is fine to just report the receipt status as "Succeeded"
  SuccessReceiptId: "Succeeded",
};

export interface Props {
  status: ReceiptExecutionStatus;
}
const ReceiptExecutionStatusComponent = ({ status }: Props) => {
  return <>{EXECUTION_RECEIPT_STATUSES[status]}</>;
};

export default ReceiptExecutionStatusComponent;
