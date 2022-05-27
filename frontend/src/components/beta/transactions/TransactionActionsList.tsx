import * as React from "react";
import { styled } from "../../../libraries/styles";
import { TransactionDetails } from "../../../types/common";

import TransactionReceipt from "./TransactionReceipt";

type Props = {
  transaction: TransactionDetails;
};

const Contaier = styled("div", {
  minHeight: "calc(100vh - 360px)",
  background: "#fff",
});

const Wrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: 1161,
  margin: "auto",
  padding: "24px 40px",
  fontFamily: "Manrope",
});

const Title = styled("h4", {
  fontFamily: "Manrope",
  width: "100%",
  fontSize: 16,
  fontWeight: "700",
  lineHeight: "28px",
  borderBottom: "1px solid rgba(0, 0, 0, .1)",
  marginBottom: 30,
  paddingBottom: 8,
});

const TransactionActionsList: React.FC<Props> = React.memo(
  ({ transaction: { receipt, refundReceipts } }) => {
    const refundReceiptsMap = new Map();
    refundReceipts.forEach((receipt) => {
      // handle multiple refunds per receipt
      if (refundReceiptsMap.has(receipt.parentReceiptHash)) {
        refundReceiptsMap.set(receipt.parentReceiptHash, [
          ...refundReceiptsMap.get(receipt.parentReceiptHash),
          receipt,
        ]);
      } else {
        refundReceiptsMap.set(receipt.parentReceiptHash, [receipt]);
      }
    });

    return (
      <Contaier>
        <Wrapper>
          <Title>Execution Plan</Title>
          <TransactionReceipt
            receipt={receipt}
            refundReceiptsMap={refundReceiptsMap}
          />
        </Wrapper>
      </Contaier>
    );
  }
);

export default TransactionActionsList;
