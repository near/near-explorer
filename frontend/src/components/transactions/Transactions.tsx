import React from "react";

import TransactionsApi, * as T from "../../libraries/explorer-wamp/transactions";

import FlipMove from "../utils/FlipMove";
// import PaginationSpinner from "../utils/PaginationSpinner";
import autoRefreshHandler from "../utils/autoRefreshHandler";

import TransactionsList from "./TransactionsList";

export interface OuterProps {
  accountId?: string;
  blockHash?: string;
  reversed: boolean;
  count: number;
}

interface State {
  update: boolean;
}

export default class extends React.Component<OuterProps, State> {
  static defaultProps = {
    reversed: false,
    count: 15
  };

  state: State = {
    update: false
  };

  componentDidUpdate(preProps: any) {
    if (this.props.accountId !== preProps.accountId) {
      this.setState({ update: true });
    }
  }

  fetchTransactions = async () => {
    return await new TransactionsApi().getTransactions({
      signerId: this.props.accountId,
      receiverId: this.props.accountId,
      blockHash: this.props.blockHash,
      tail: this.props.reversed,
      limit: this.props.count
    });
  };

  autoRefreshTransactions = autoRefreshHandler(
    Transactions,
    this.fetchTransactions,
    this.state.update,
    this.props
  );

  render() {
    return <this.autoRefreshTransactions />;
  }
}

interface InnerProps {
  items: T.Transaction[];
  reversed: boolean;
}

class Transactions extends React.Component<InnerProps> {
  render() {
    const { items, reversed } = this.props;
    return (
      <FlipMove duration={1000} staggerDurationBy={0}>
        <TransactionsList transactions={items} reversed={reversed} />
      </FlipMove>
    );
  }
}
