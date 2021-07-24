import { ReceiptExecutionStatus } from "../../libraries/explorer-wamp/receipts";
import { Translate, TranslateFunction } from "react-localize-redux";

const getExecutionReceiptStatuses = (
  status: ReceiptExecutionStatus,
  translate: TranslateFunction
): String => {
  switch (status) {
    case "Unknown":
      return translate(
        "component.receipts.ReceiptExecutionStatus.unknown"
      ).toString();
    case "Failure":
      return translate(
        "component.receipts.ReceiptExecutionStatus.failure"
      ).toString();
    case "SuccessValue":
      return translate(
        "component.receipts.ReceiptExecutionStatus.success_value"
      ).toString();
    // The transaction execution status will be recursively deferred to the status of the receipt id,
    // but given we only care about the details when we display the whole transaction execution plan,
    // it is fine to just report the receipt status as "Succeeded"
    case "SuccessReceiptId":
      return translate(
        "component.receipts.ReceiptExecutionStatus.success_receiptId"
      ).toString();
  }
  return "";
};

export interface Props {
  status: ReceiptExecutionStatus;
}

const ReceiptExecutionStatusComponent = (prop: Props) => {
  return (
    <Translate>
      {({ translate }) => (
        <>{getExecutionReceiptStatuses(prop.status, translate)}</>
      )}
    </Translate>
  );
};

export default ReceiptExecutionStatusComponent;
