import * as React from "react";
import { KeysOfUnion, RPC } from "../../types/common";
import { useTranslation } from "react-i18next";

export interface Props {
  status: KeysOfUnion<RPC.FinalExecutionStatus>;
}
const TransactionExecutionStatusComponent: React.FC<Props> = React.memo(
  ({ status }) => {
    const { t } = useTranslation();
    return <>{t(`common.transactions.status.${status}`)}</>;
  }
);

export default TransactionExecutionStatusComponent;
