import { PureComponent } from "react";
import TransactionsApi, * as T from "../../libraries/explorer-wamp/transactions";

import TransactionLink from "../utils/TransactionLink";
import ActionGroup from "./ActionGroup";
import { ViewMode } from "./ActionRowBlock";
import TransactionExecutionStatus from "./TransactionExecutionStatus";

import { Translate } from "react-localize-redux";

export interface Props {
  transaction: T.Transaction;
  viewMode?: ViewMode;
}

interface State {
  status?: T.ExecutionStatus;
}

class TransactionAction extends PureComponent<Props, State> {
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
      <Translate>
        {({ translate }) => (
          <ActionGroup
            actionGroup={transaction as T.Transaction}
            detailsLink={<TransactionLink transactionHash={transaction.hash} />}
            status={
              status ? (
                <TransactionExecutionStatus status={status} />
              ) : (
                <Translate id="common.transactions.status.fetching_status" />
              )
            }
            viewMode={viewMode}
            title={translate(
              "component.transactions.TransactionAction.batch_transaction"
            ).toString()}
          />
        )}
      </Translate>
    );
  }
}

export default TransactionAction;
