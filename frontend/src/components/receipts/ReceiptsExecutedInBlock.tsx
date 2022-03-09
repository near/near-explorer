import * as React from "react";

import { useWampSimpleQuery } from "../../hooks/wamp";
import ReceiptsList from "./ReceiptsList";

interface Props {
  blockHash: string;
}

const ReceiptsExecutedInBlock: React.FC<Props> = ({ blockHash }) => {
  const receiptsList = useWampSimpleQuery(
    "executed-receipts-list-by-block-hash",
    [blockHash]
  );
  return <ReceiptsList receiptsList={receiptsList} />;
};

export default ReceiptsExecutedInBlock;
