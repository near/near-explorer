import * as React from "react";
import { styled } from "../../../libraries/styles";
import {
  TransactionDetails,
  TransactionReceipt as TxReceipt,
} from "../../../types/common";

import TransactionReceipt from "./TransactionReceipt";

type Props = {
  transaction: TransactionDetails;
};

const Wrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: 1161,
  margin: "auto",
  padding: "24px 40px",
  fontFamily: "Manrope",
});

const TransactionActionsList: React.FC<Props> = React.memo(
  ({ transaction: { receipts, refundReceipts } }) => {
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
      <Wrapper>
        {receipts.map((receipt: TxReceipt) => (
          <TransactionReceipt
            key={receipt.receiptId}
            receipt={receipt}
            refundReceipts={refundReceiptsMap.get(receipt.receiptId)}
          />
        ))}
      </Wrapper>
    );
  }
);

export default TransactionActionsList;
