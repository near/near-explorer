import * as React from "react";

import { useTranslation } from "react-i18next";

import { Receipt } from "@explorer/common/types/procedures";
import ReceiptExecutionStatus from "@explorer/frontend/components/receipts/ReceiptExecutionStatus";
import ActionGroup from "@explorer/frontend/components/transactions/ActionGroup";
import ReceiptLink from "@explorer/frontend/components/utils/ReceiptLink";

interface Props {
  receipts: Receipt[];
}

const Receipts: React.FC<Props> = React.memo(({ receipts }) => {
  const { t } = useTranslation();
  return (
    <>
      {receipts.map((receipt, index) => (
        <ActionGroup
          key={`${receipt.id}_${index}`}
          actionGroup={receipt}
          detailsLink={
            <ReceiptLink
              transactionHash={receipt.originatedFromTransactionHash}
              receiptId={receipt.id}
            />
          }
          status={<ReceiptExecutionStatus status={receipt.status} />}
          title={t("component.receipts.ReceiptAction.batch_receipt")}
        />
      ))}
    </>
  );
});

export default Receipts;
