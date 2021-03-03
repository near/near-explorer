import { ExecutionStatus } from "../../libraries/explorer-wamp/transactions";

const EXECUTION_STATUSES: Record<ExecutionStatus, string> = {
  NotStarted: "Not started",
  Started: "Started",
  Failure: "Failed",
  SuccessValue: "Succeeded",
};

export interface Props {
  status: ExecutionStatus;
}
const Status = ({ status }: Props) => {
  return EXECUTION_STATUSES[status];
};

export default Status;
