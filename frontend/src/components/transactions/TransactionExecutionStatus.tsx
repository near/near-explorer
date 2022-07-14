import * as React from "react";
import { Transaction } from "../../types/common";
import { useTranslation } from "react-i18next";

export interface Props {
  status: Transaction["status"];
}
const TransactionExecutionStatusComponent: React.FC<Props> = React.memo(
  ({ status }) => {
    const { t } = useTranslation();
    return <>{t(`common.transactions.status.${status}`)}</>;
  }
);

export default TransactionExecutionStatusComponent;
