import * as React from "react";
import Link from "./Link";

export interface Props {
  transactionHash: string;
  receiptId: string;
  truncate?: boolean;
  children?: React.ReactNode;
}

const ReceiptLink: React.FC<Props> = React.memo(
  ({ transactionHash, receiptId, truncate = true }) => {
    const children = truncate ? `${receiptId.substring(0, 7)}...` : receiptId;
    return (
      <Link href={`/transactions/${transactionHash}#${receiptId}`}>
        <a>{children}</a>
      </Link>
    );
  }
);

export default ReceiptLink;
