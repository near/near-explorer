import * as React from "react";

import { useTranslation } from "next-i18next";

import { TransactionStatus } from "@explorer/common/types/procedures";

export interface Props {
  status: TransactionStatus;
}
const TransactionExecutionStatusComponent: React.FC<Props> = React.memo(
  ({ status }) => {
    const { t } = useTranslation();
    return <>{t(`common.transactions.status.${status}`)}</>;
  }
);

export default TransactionExecutionStatusComponent;
