import * as React from "react";

import { useTranslation } from "next-i18next";

import { Receipt } from "@/common/types/procedures";
import Receipts from "@/frontend/components/receipts/Receipts";
import PaginationSpinner from "@/frontend/components/utils/PaginationSpinner";
import Placeholder from "@/frontend/components/utils/Placeholder";

interface Props {
  receiptsList?: Receipt[];
}

const ReceiptsList: React.FC<Props> = React.memo(({ receiptsList }) => {
  const { t } = useTranslation();
  return (
    <>
      {!receiptsList ? (
        <PaginationSpinner />
      ) : receiptsList.length > 0 ? (
        <Receipts receipts={receiptsList} />
      ) : (
        <Placeholder>
          {t("component.receipts.ReceiptsList.no_receipts")}
        </Placeholder>
      )}
    </>
  );
});

export default ReceiptsList;
