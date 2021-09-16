import { Component } from "react";

import TransactionsApi, * as T from "../../libraries/explorer-wamp/transactions";

import FlipMove from "../utils/FlipMove";
import ListHandler from "../utils/ListHandler";
import Placeholder from "../utils/Placeholder";

import TransactionAction from "./TransactionAction";

import { Translate } from "react-localize-redux";

export interface OuterProps {
  accountId?: string;
  blockHash?: string;
  count: number;
}

class TransactionsWrapper extends Component<OuterProps> {
  static defaultProps = {
    count: 15,
  };

  fetchTransactions = async (
    count: number,
    paginationIndexer?: T.TxPagination
  ) => {
    return await new TransactionsApi().getTransactionsFromIndexer({
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
    detailPage: this.props.accountId || this.props.blockHash ? true : false,
  };

  TransactionsList = ListHandler(Transactions, this.config);

  render() {
    return <this.TransactionsList />;
  }
}

interface InnerProps extends OuterProps {
  items: T.Transaction[];
}

class Transactions extends Component<InnerProps> {
  render() {
    const { items } = this.props;

    if (items?.length === 0) {
      return (
        <Placeholder>
          <Translate id="component.transactions.Transactions.no_transactions" />
        </Placeholder>
      );
    }

    return (
      <FlipMove duration={1000} staggerDurationBy={0}>
        {items &&
          items.map((transaction) => (
            <TransactionAction
              key={transaction.hash}
              transaction={transaction}
            />
          ))}
      </FlipMove>
    );
  }
}

export default TransactionsWrapper;
