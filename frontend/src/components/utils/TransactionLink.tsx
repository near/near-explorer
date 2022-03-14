import * as React from "react";
import Link from "../utils/Link";

export interface Props {
  transactionHash: string;
  children?: React.ReactNode;
}

const TransactionLink: React.FC<Props> = React.memo(
  ({ transactionHash, children }) => (
    <Link href="/transactions/[hash]" as={`/transactions/${transactionHash}`}>
      <a>{children || `${transactionHash.substring(0, 7)}...`}</a>
    </Link>
  )
);

export default TransactionLink;
