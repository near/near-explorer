import * as React from "react";

import { useFetch } from "../../hooks/use-fetch";
import ReceiptsList from "./ReceiptsList";

interface Props {
  blockHash: string;
}

const ReceiptsIncludedInBlock: React.FC<Props> = React.memo(({ blockHash }) => {
  const receiptsList = useFetch("included-receipts-list-by-block-hash", [
    blockHash,
  ]);
  return <ReceiptsList receiptsList={receiptsList} />;
});

export default ReceiptsIncludedInBlock;
