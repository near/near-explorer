import React from "react";

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

export default class extends React.Component<Props> {
  render() {
    return EXECUTION_STATUSES[this.props.status];
  }
}
