import { ExecutionStatus } from "../../libraries/explorer-wamp/transactions";
import { Translate } from "react-localize-redux";

export interface Props {
  status: ExecutionStatus;
}
const TransactionExecutionStatusComponent = ({ status }: Props) => {
  return <Translate id={`common.transactions.status.${status}`} />;
};

export default TransactionExecutionStatusComponent;
