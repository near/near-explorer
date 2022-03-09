import { KeysOfUnion, RPC } from "../../libraries/wamp/types";
import { useTranslation } from "react-i18next";

export interface Props {
  status: KeysOfUnion<RPC.FinalExecutionStatus>;
}
const TransactionExecutionStatusComponent = ({ status }: Props) => {
  const { t } = useTranslation();
  return <>{t(`common.transactions.status.${status}`)}</>;
};

export default TransactionExecutionStatusComponent;
