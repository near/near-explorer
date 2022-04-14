import * as React from "react";
import { styled } from "../../../libraries/styles";
import { Transaction } from "../../../types/transaction";

import TransactionReceipt from "./TransactionReceipt";

type Props = {
  transaction: Transaction;
};

const Wrapper = styled("div", {
  paddingVertical: 24,
  // TODO: Place a proper padding here
  paddingHorizontal: 40,
  display: "flex",
  flexDirection: "column",
  fontFamily: "Manrope",
});

const TransactionActionsList: React.FC<Props> = React.memo(
  ({ transaction: { receipts, refundReceipts } }) => {
    const refundReceiptsMap = new Map();
    refundReceipts.forEach((receipt) => {
      refundReceiptsMap.set(receipt.parentReceiptHash, receipt);
    });

    return (
      <Wrapper>
        {receipts.map((receipt: any) => {
          const refundReceipt = refundReceiptsMap.get(
            receipt.parentReceiptHash
          );
          if (!refundReceipt) {
            return (
              <TransactionReceipt
                key={receipt.receiptId}
                receipt={receipt}
                refundReceipt={refundReceiptsMap.get(receipt.receiptId)}
              />
            );
          }
        })}
      </Wrapper>
    );
  }
);

export default TransactionActionsList;
