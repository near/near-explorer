import * as React from "react";
import { styled } from "../../libraries/styles";
import Link from "./Link";

const DisabledLink = styled("span", {
  color: "#24272a",
});

export interface Props {
  transactionHash?: string | null;
  receiptId: string;
  truncate?: boolean;
  children?: React.ReactNode;
}

const ReceiptLink: React.FC<Props> = React.memo(
  ({ transactionHash, receiptId, truncate = true }) => {
    const children = truncate ? `${receiptId.substring(0, 7)}...` : receiptId;
    if (!transactionHash) {
      return <DisabledLink title={receiptId}>{children}</DisabledLink>;
    }
    return (
      <Link href={`/transactions/${transactionHash}#${receiptId}`}>
        <a>{children}</a>
      </Link>
    );
  }
);

export default ReceiptLink;
