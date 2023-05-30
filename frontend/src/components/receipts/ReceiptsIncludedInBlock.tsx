import * as React from "react";

import { ReceiptsList } from "@/frontend/components/receipts/ReceiptsList";
import { trpc } from "@/frontend/libraries/trpc";

interface Props {
  blockHash: string;
}

export const ReceiptsIncludedInBlock: React.FC<Props> = React.memo(
  ({ blockHash }) => {
    const { data: receiptsList } =
      trpc.receipt.listIncludedByBlockHash.useQuery({
        blockHash,
      });
    return <ReceiptsList receiptsList={receiptsList} />;
  }
);
