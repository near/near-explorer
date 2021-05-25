import React from "react";
import TransactionsApi, * as T from "../../libraries/explorer-wamp/transactions";

import ActionGroup from "./ActionGroup";
import { ViewMode } from "./ActionRowBlock";

export interface Props {
  transaction: T.Transaction;
  viewMode?: ViewMode;
}

interface State {
  status?: T.ExecutionStatus;
}

class TransactionAction extends React.PureComponent<Props, State> {
  static defaultProps = {
    viewMode: "sparse",
  };

  state: State = {};

  componentDidMount() {
    this.fetchStatus();
  }

  fetchStatus = async () => {
    const status = await new TransactionsApi().getTransactionStatus(
      this.props.transaction
    );
    this.setState({ status });
  };

  render() {
    const { transaction, viewMode } = this.props;
    const { status } = this.state;
    if (!transaction.actions) {
      return null;
    }
    return (
      <ActionGroup
        actionGroup={transaction}
        status={status}
        viewMode={viewMode}
        title={"Batch Transaction"}
      />
    );
  }
}

export default TransactionAction;
