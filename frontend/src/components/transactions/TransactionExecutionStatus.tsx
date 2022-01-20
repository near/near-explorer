import { ExecutionStatus } from "../../libraries/explorer-wamp/transactions";
import { useTranslation } from "react-i18next";

export interface Props {
  status: ExecutionStatus;
}
const TransactionExecutionStatusComponent = ({ status }: Props) => {
  const { t } = useTranslation();
  return <>{t(`common.transactions.status.${status}`)}</>;
};

export default TransactionExecutionStatusComponent;
