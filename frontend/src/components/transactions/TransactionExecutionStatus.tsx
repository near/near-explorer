import * as React from "react";
import { TransactionStatus } from "../../types/common";
import { useTranslation } from "react-i18next";

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
