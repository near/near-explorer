import * as React from "react";

import { styled } from "../../../libraries/styles";
import { TransactionReceipt } from "../../../types/transaction";

import ReceiptAction from "./ReceiptAction";
import { Action } from "../../../libraries/wamp/types";

type Props = {
  receipt: TransactionReceipt;
};

const DetailsWrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
});

const ReceiptDetails: React.FC<Props> = React.memo(({ receipt }) => (
  <DetailsWrapper>
    {receipt.actions.map((action: Action) => (
      <ReceiptAction
        key={receipt.receiptId}
        action={action}
        receipt={receipt}
      />
    ))}
  </DetailsWrapper>
));

export default ReceiptDetails;
