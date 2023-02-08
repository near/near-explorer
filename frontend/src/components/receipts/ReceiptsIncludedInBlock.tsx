import * as React from "react";

import { trpc } from "@explorer/frontend/libraries/trpc";
import ReceiptsList from "@explorer/frontend/components/receipts/ReceiptsList";

interface Props {
  blockHash: string;
}

const ReceiptsIncludedInBlock: React.FC<Props> = React.memo(({ blockHash }) => {
  const { data: receiptsList } = trpc.useQuery([
    "receipt.listIncludedByBlockHash",
    { blockHash },
  ]);
  return <ReceiptsList receiptsList={receiptsList} />;
});

export default ReceiptsIncludedInBlock;
