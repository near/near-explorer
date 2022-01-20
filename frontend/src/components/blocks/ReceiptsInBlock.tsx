import { FC, useState, useEffect } from "react";

import ReceiptsApi, { Receipt } from "../../libraries/explorer-wamp/receipts";

import Receipts from "../receipts/Receipts";
import Placeholder from "../utils/Placeholder";
import PaginationSpinner from "../utils/PaginationSpinner";

import { useTranslation } from "react-i18next";

interface Props {
  blockHash: string;
}

const ReceiptsInBlock: FC<Props> = ({ blockHash }) => {
  const { t } = useTranslation();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!blockHash) {
      return;
    }
    setLoading(true);
    new ReceiptsApi().queryReceiptsList(blockHash).then((receipts) => {
      setReceipts(receipts);
      setLoading(false);
    });
  }, [blockHash, setReceipts, setLoading]);

  return (
    <>
      {loading ? (
        <PaginationSpinner hidden={false} />
      ) : receipts.length > 0 ? (
        <Receipts receipts={receipts} />
      ) : (
        <Placeholder>
          {t("component.blocks.ReceiptsInBlock.no_receipts")}
        </Placeholder>
      )}
    </>
  );
};

export default ReceiptsInBlock;
