import * as React from "react";
import { styled } from "../../../libraries/styles";

import TransactionReceipt from "./TransactionReceipt";

type Props = {
  transaction: any;
};

const Wrapper = styled("div", {
  paddingVertical: 24,
  // TODO: Place a proper padding here
  paddingHorizontal: 40,
  display: "flex",
  flexDirection: "column",
  fontFamily: "Manrope",
});

const TransactionActionsList: React.FC<Props> = React.memo((props) => {
  return (
    <Wrapper>
      {props.transaction.receipts.map((receipt: any) => (
        <TransactionReceipt key={receipt.receiptId} receipt={receipt} />
      ))}
    </Wrapper>
  );
});

export default TransactionActionsList;
