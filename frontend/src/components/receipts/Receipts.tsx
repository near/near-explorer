import * as React from "react";
import { useTranslation } from "react-i18next";

import { Receipt } from "../../libraries/wamp/types";

import ActionGroup from "../transactions/ActionGroup";
import ReceiptLink from "../utils/ReceiptLink";
import ReceiptExecutionStatus from "./ReceiptExecutionStatus";

interface Props {
  receipts: Receipt[];
}

const Receipts: React.FC<Props> = React.memo(({ receipts }) => {
  const { t } = useTranslation();
  return (
    <>
      {receipts.map((receipt, index) => (
        <ActionGroup
          key={`${receipt.receiptId}_${index}`}
          actionGroup={receipt}
          detailsLink={
            <ReceiptLink
              transactionHash={receipt.originatedFromTransactionHash}
              receiptId={receipt.receiptId}
            />
          }
          status={
            receipt.status ? (
              <ReceiptExecutionStatus status={receipt.status} />
            ) : (
              <>{t("component.receipts.ReceiptAction.fetching_status")}</>
            )
          }
          title={t("component.receipts.ReceiptAction.batch_receipt")}
        />
      ))}
    </>
  );
});

export default Receipts;
