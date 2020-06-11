import React from "react";

import TransactionsApi, * as T from "../../libraries/explorer-wamp/transactions";

import BatchTransactionIcon from "../../../public/static/images/icon-m-batch.svg";

import ActionRow from "./ActionRow";
import ActionRowBlock, { ViewMode } from "./ActionRowBlock";
import ActionsList from "./ActionsList";

export interface Props {
  actions: T.Action[];
  transaction: T.Transaction;
  viewMode?: ViewMode;
}

interface State {
  status?: T.ExecutionStatus;
  isFinal?: boolean;
}

export default class extends React.Component<Props, State> {
  static defaultProps = {
    viewMode: "sparse",
  };

  state: State = {};

  componentDidMount() {
    this.fetchFinalStamp();
    this.fetchStatus();
  }

  fetchStatus = async () => {
    const status = await new TransactionsApi().getTransactionStatus(
      this.props.transaction
    );
    this.setState({ status });
  };

  fetchFinalStamp = async () => {
    const finalStamp = await new TransactionsApi().queryFinalTimestamp();
    this.setState({
      isFinal: this.props.transaction.blockTimestamp <= finalStamp,
    });
  };

  render() {
    const { transaction, viewMode } = this.props;
    const { status } = this.state;
    if (transaction.actions) {
      if (transaction.actions.length !== 1) {
        return (
          <ActionRowBlock
            viewMode={viewMode}
            transaction={transaction}
            icon={<BatchTransactionIcon />}
            title={"Batch Transaction"}
            status={status}
          >
            <ActionsList
              actions={transaction.actions}
              transaction={transaction}
              viewMode={viewMode}
              detalizationMode="minimal"
            />
          </ActionRowBlock>
        );
      }
      return (
        <ActionRow
          action={transaction.actions[0]}
          transaction={transaction}
          viewMode={viewMode}
          detalizationMode="detailed"
          status={status}
        />
      );
    }
    return <></>;
  }
}
