import * as React from "react";

import { useTranslation } from "next-i18next";

import { TransactionStatus as StatusType } from "@/common/types/procedures";

export interface Props {
  status: StatusType;
}
export const TransactionExecutionStatus: React.FC<Props> = React.memo(
  ({ status }) => {
    const { t } = useTranslation();
    return <>{t(`common.transactions.status.${status}`)}</>;
  }
);
