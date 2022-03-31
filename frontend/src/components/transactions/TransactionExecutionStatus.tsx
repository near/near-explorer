import * as React from "react";
import { ExecutionStatus } from "../../libraries/wamp/types";
import { useTranslation } from "react-i18next";

export interface Props {
  status: ExecutionStatus;
}
const TransactionExecutionStatusComponent: React.FC<Props> = React.memo(
  ({ status }) => {
    const { t } = useTranslation();
    return <>{t(`common.transactions.status.${status}`)}</>;
  }
);

export default TransactionExecutionStatusComponent;
