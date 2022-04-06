import * as React from "react";
import { Args } from "../../transactions/ActionMessage";

type Props = {
  status: any;
};

const ReceiptStatus: React.FC<Props> = React.memo((props) => {
  let statusInfo = null;
  if ("SuccessValue" in props.status) {
    const { SuccessValue } = props.status;
    statusInfo = <Args args={SuccessValue} />;
  } else if ("Failure" in props.status) {
    const { Failure } = props.status;
    statusInfo = <pre>{JSON.stringify(Failure, null, 2)}</pre>;
  } else if ("SuccessReceiptId" in props.status) {
    const { SuccessReceiptId } = props.status;
    statusInfo = <pre>{SuccessReceiptId}</pre>;
  }
  return statusInfo;
});

export default ReceiptStatus;
