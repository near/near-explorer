import * as React from "react";

import { useTranslation } from "next-i18next";

import { Receipt } from "@/common/types/procedures";
import ReceiptExecutionStatus from "@/frontend/components/receipts/ReceiptExecutionStatus";
import ActionGroup from "@/frontend/components/transactions/ActionGroup";
import ReceiptLink from "@/frontend/components/utils/ReceiptLink";

interface Props {
  receipts: Receipt[];
}

const Receipts: React.FC<Props> = React.memo(({ receipts }) => {
  const { t } = useTranslation();
  return (
    <>
      {receipts.map((receipt) => (
        <ActionGroup
          key={receipt.id}
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
