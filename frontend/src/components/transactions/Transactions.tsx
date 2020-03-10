import React from "react";

import TransactionsApi, * as T from "../../libraries/explorer-wamp/transactions";

import FlipMove from "../utils/FlipMove";
import PaginationSpinner from "../utils/PaginationSpinner";
import autoRefreshHandler from "../utils/autoRefreshHandler";

import TransactionsList from "./TransactionsList";

export interface Props {
  accountId?: string;
  blockHash?: string;
  reversed: boolean;
  count: number;
}

export default class extends React.Component<Props> {
  static defaultProps = {
    reversed: false,
    count: 15
  };

  componentDidUpdate(prevProps: Props) {
    if (this.props.accountId !== prevProps.accountId) {
      this.setState({ transactions: [] });
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

  autoRefreshTransactions = autoRefreshHandler(TxList, this.fetchTransactions);

  render() {
    return <this.autoRefreshTransactions />;
  }
}

interface TxListProps {
  items: T.Transaction[];
  reversed: boolean;
}

class TxList extends React.Component<TxListProps> {
  static defaultProps = {
    items: [],
    reversed: true // have to keep it to true, otherwise will be false forever
  };

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
