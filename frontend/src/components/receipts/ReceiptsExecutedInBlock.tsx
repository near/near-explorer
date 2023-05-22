import * as React from "react";

import ReceiptsList from "@/frontend/components/receipts/ReceiptsList";
import { trpc } from "@/frontend/libraries/trpc";

interface Props {
  blockHash: string;
}

const ReceiptsExecutedInBlock: React.FC<Props> = React.memo(({ blockHash }) => {
  const { data: receiptsList } = trpc.receipt.listExecutedByBlockHash.useQuery({
    blockHash,
  });
  return <ReceiptsList receiptsList={receiptsList} />;
});

export default ReceiptsExecutedInBlock;
