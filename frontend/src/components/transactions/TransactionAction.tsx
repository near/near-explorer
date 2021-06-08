import React from "react";
import TransactionsApi, * as T from "../../libraries/explorer-wamp/transactions";

import TransactionLink from "../utils/TransactionLink";
import ActionGroup from "./ActionGroup";
import { ViewMode } from "./ActionRowBlock";
import TransactionExecutionStatus from "./TransactionExecutionStatus";

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
    const transactionStatus = status ? (
      <TransactionExecutionStatus status={status} />
    ) : (
      <>{"Fetching Status..."}</>
    );
    if (!transaction.actions) {
      return null;
    }
    return (
      <ActionGroup
        actionGroup={transaction as T.Transaction}
        detailsLink={<TransactionLink transactionHash={transaction.hash} />}
        status={transactionStatus}
        viewMode={viewMode}
        title={"Batch Transaction"}
      />
    );
  }
}

export default TransactionAction;
