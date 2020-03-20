import React from "react";

import TransactionsApi, * as T from "../../libraries/explorer-wamp/transactions";

import FlipMove from "../utils/FlipMove";
import PaginationSpinner from "../utils/PaginationSpinner";
import autoRefreshHandler from "../utils/autoRefreshHandler";

import TransactionsList from "./TransactionsList";

export interface OuterProps {
  accountId?: string;
  blockHash?: string;
  reversed: boolean;
  count: number;
}

export default class extends React.Component<OuterProps> {
  static defaultProps = {
    reversed: false,
    count: 15
  };

  fetchTransactions = async (count: number, endTimestamp?: number) => {
    return await new TransactionsApi().getTransactions({
      signerId: this.props.accountId,
      receiverId: this.props.accountId,
      blockHash: this.props.blockHash,
      tail: this.props.reversed,
      limit: count,
      endTimestamp: endTimestamp
    });
  };

  autoRefreshTransactions = autoRefreshHandler(
    Transactions,
    this.fetchTransactions,
    this.props.count,
    true,
    this.props
  );

  render() {
    return <this.autoRefreshTransactions />;
  }
}

interface InnerProps extends OuterProps {
  items: T.Transaction[];
}

class Transactions extends React.Component<InnerProps> {
  render() {
    const { items, reversed } = this.props;
    if (items.length === 0) {
      return <PaginationSpinner hidden={false} />;
    }
    return (
      <FlipMove duration={1000} staggerDurationBy={0}>
        <TransactionsList transactions={items} reversed={reversed} />
      </FlipMove>
    );
  }
}
