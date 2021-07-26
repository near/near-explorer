import { ReceiptExecutionStatus } from "../../libraries/explorer-wamp/receipts";
import { Translate } from "react-localize-redux";

export interface Props {
  status: ReceiptExecutionStatus;
}
const ReceiptExecutionStatusComponent = ({ status }: Props) => {
  // The "SuccessReceiptId" transaction execution status will be recursively deferred to the status of the receipt id,
  // but given we only care about the details when we display the whole transaction execution plan,
  // it is fine to just report the receipt status as "Succeeded"
  return <Translate id={`common.receipts.status.${status}`} />;
};

export default ReceiptExecutionStatusComponent;
