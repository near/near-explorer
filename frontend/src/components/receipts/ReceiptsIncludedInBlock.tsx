import { FC } from "react";

import { useWampSimpleQuery } from "../../hooks/wamp";
import ReceiptsList from "./ReceiptsList";

interface Props {
  blockHash: string;
}

const ReceiptsIncludedInBlock: FC<Props> = ({ blockHash }) => {
  const receiptsList = useWampSimpleQuery(
    "included-receipts-list-by-block-hash",
    [blockHash]
  );
  return <ReceiptsList receiptsList={receiptsList} />;
};

export default ReceiptsIncludedInBlock;
