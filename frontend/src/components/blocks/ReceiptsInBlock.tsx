import { FC } from "react";

import Receipts from "../receipts/Receipts";
import Placeholder from "../utils/Placeholder";
import PaginationSpinner from "../utils/PaginationSpinner";

import { useTranslation } from "react-i18next";
import { useWampSimpleQuery } from "../../hooks/wamp";

interface Props {
  blockHash: string;
}

const ReceiptsInBlock: FC<Props> = ({ blockHash }) => {
  const { t } = useTranslation();
  const receiptsList = useWampSimpleQuery("receipts-list-by-block-hash", [
    blockHash,
  ]);

  return (
    <>
      {!receiptsList ? (
        <PaginationSpinner />
      ) : receiptsList.length > 0 ? (
        <Receipts receipts={receiptsList} />
      ) : (
        <Placeholder>
          {t("component.blocks.ReceiptsInBlock.no_receipts")}
        </Placeholder>
      )}
    </>
  );
};

export default ReceiptsInBlock;
