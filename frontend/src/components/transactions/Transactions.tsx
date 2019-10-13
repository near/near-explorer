import React from "react";

import * as TransactionsApi from "../../libraries/explorer-wamp/transactions";

import TransactionsList from "./TransactionsList";

export interface Props {
  accountId?: string;
  blockHash?: string;
}

export interface State {
  transactions: TransactionsApi.Transaction[] | null;
}

export default class extends React.PureComponent<Props, State> {
  state: State = {
    transactions: null
  };

  componentDidMount() {
    this.fetchTransactions();
  }

  componentDidUpdate() {
    this.fetchTransactions();
  }

  render() {
    const { transactions } = this.state;
    if (transactions === null) {
      return null;
    }
    return <TransactionsList transactions={transactions} />;
  }

  fetchTransactions = async () => {
    const transactions = await TransactionsApi.getTransactions({
      signerId: this.props.accountId,
      receiverId: this.props.accountId,
      blockHash: this.props.blockHash
    });
    this.setState({ transactions });
  };
}
