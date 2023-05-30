import * as React from "react";

import { Link } from "@/frontend/components/utils/Link";

export interface Props {
  transactionHash: string;
  children?: React.ReactNode;
}

export const TransactionLink: React.FC<Props> = React.memo(
  ({ transactionHash, children }) => (
    <Link href={`/transactions/${transactionHash}`}>
      {children || `${transactionHash.substring(0, 7)}...`}
    </Link>
  )
);
