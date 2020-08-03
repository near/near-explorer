import React from "react";

import TransactionsApi, * as T from "../../libraries/explorer-wamp/transactions";

import FlipMove from "../utils/FlipMove";
import ListHandler from "../utils/ListHandler";

import TransactionAction from "./TransactionAction";

export interface OuterProps {
  accountId?: string;
  blockHash?: string;
  count: number;
}

export default class extends React.Component<OuterProps> {
  static defaultProps = {
    count: 15,
  };

  fetchTransactions = async (
    count: number,
    paginationIndexer?: T.TxPagination
  ) => {
    return await new TransactionsApi().getTransactions({
      signerId: this.props.accountId,
      receiverId: this.props.accountId,
      blockHash: this.props.blockHash,
      limit: count,
      paginationIndexer: paginationIndexer,
    });
  };

  config = {
    fetchDataFn: this.fetchTransactions,
    count: this.props.count,
    category: "Transaction",
  };

  TransactionsList = ListHandler(Transactions, this.config);

  render() {
    return <this.TransactionsList />;
  }
}

interface InnerProps extends OuterProps {
  items: T.Transaction[];
}

class Transactions extends React.Component<InnerProps> {
  render() {
    const { items } = this.props;
    return (
      <FlipMove duration={1000} staggerDurationBy={0}>
        {items &&
          items.map((transaction) => (
            <TransactionAction
              key={transaction.hash}
              actions={transaction.actions}
              transaction={transaction}
            />
          ))}
      </FlipMove>
    );
  }
}
