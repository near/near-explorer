import * as React from "react";

import { trpc } from "../../libraries/trpc";
import ReceiptsList from "./ReceiptsList";

interface Props {
  blockHash: string;
}

const ReceiptsExecutedInBlock: React.FC<Props> = React.memo(({ blockHash }) => {
  const { data: receiptsList } = trpc.useQuery([
    "executed-receipts-list-by-block-hash",
    [blockHash],
  ]);
  return <ReceiptsList receiptsList={receiptsList} />;
});

export default ReceiptsExecutedInBlock;
