import * as React from "react";

import { useTranslation } from "next-i18next";

import { ReceiptExecutionStatus as StatusType } from "@/common/types/procedures";

export interface Props {
  status: StatusType;
}

export const ReceiptExecutionStatus: React.FC<Props> = React.memo(
  ({ status }) => {
    const { t } = useTranslation();
    // The "SuccessReceiptId" transaction execution status will be recursively deferred to the status of the receipt id,
    // but given we only care about the details when we display the whole transaction execution plan,
    // it is fine to just report the receipt status as "Succeeded"
    return <>{t(`common.receipts.status.${status}`)}</>;
  }
);
