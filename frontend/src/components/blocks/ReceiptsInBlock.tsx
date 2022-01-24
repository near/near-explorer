import { FC, useState, useEffect } from "react";

import ReceiptsApi, { Receipt } from "../../libraries/explorer-wamp/receipts";

import Receipts from "../receipts/Receipts";
import Placeholder from "../utils/Placeholder";
import PaginationSpinner from "../utils/PaginationSpinner";

import { useTranslation } from "react-i18next";

interface Props {
  includedInBlockHash?: string;
  executedInBlockHash?: string;
  allReceiptsInBlock?: string;
}

const ReceiptsInBlock: FC<Props> = ({
  includedInBlockHash,
  executedInBlockHash,
  allReceiptsInBlock,
}) => {
  const { t } = useTranslation();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!includedInBlockHash && !executedInBlockHash && !allReceiptsInBlock) {
      return;
    }
    setLoading(true);
    if (includedInBlockHash) {
      new ReceiptsApi()
        .queryReceiptsList(includedInBlockHash)
        .then((receipts) => {
          setReceipts(receipts);
          setLoading(false);
        });
    }
    if (executedInBlockHash) {
      new ReceiptsApi()
        .queryExecutedReceiptsList(executedInBlockHash)
        .then((receipts) => {
          setReceipts(receipts);
          setLoading(false);
        });
    }
    if (allReceiptsInBlock) {
      new ReceiptsApi()
        .queryAllReceiptsList(allReceiptsInBlock)
        .then((receipts) => {
          setReceipts(receipts);
          setLoading(false);
        });
    }
  }, [
    includedInBlockHash,
    executedInBlockHash,
    allReceiptsInBlock,
    setReceipts,
    setLoading,
  ]);

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
