import { ReceiptExecutionStatus } from "../../libraries/explorer-wamp/receipts";

const EXECUTION_RECEIPT_STATUSES: Record<ReceiptExecutionStatus, string> = {
  Unknown: "Unknown",
  Failure: "Failed",
  SuccessValue: "Succeeded",
  SuccessReceiptId: "Status is deferred to receipt",
};

export interface Props {
  status: ReceiptExecutionStatus;
}
const ReceiptExecutionStatusComponent = ({ status }: Props) => {
  return <>{EXECUTION_RECEIPT_STATUSES[status]}</>;
};

export default ReceiptExecutionStatusComponent;
