import * as React from "react";
import { styled } from "../../../libraries/styles";

import Receipt from "./Receipt";
import ReceiptInfo from "./ReceiptInfo";

type Props = {
  receipt: any;
};

const ReceiptWrapper = styled("div", {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  background: "$textColor",
  boxShadow: "0px 0px 30px rgba(66, 0, 255, 0.05)",
  borderRadius: 6,
  marginBottom: 0,

  "&:not(:first-child)": {
    margin: "10px 0",
  },

  "& > div:first-child": {
    zIndex: 1,
  },
});

const TransactionReceipt: React.FC<Props> = React.memo(({ receipt }) => {
  const [isRowActive, setRowActive] = React.useState(false);
  const switchRowActive = React.useCallback(() => setRowActive((x) => !x), [
    setRowActive,
  ]);
  return (
    <ReceiptWrapper>
      <Receipt onClick={switchRowActive} receipt={receipt} />
      <ReceiptInfo isRowActive={isRowActive} receipt={receipt} />
    </ReceiptWrapper>
  );
});

export default TransactionReceipt;
