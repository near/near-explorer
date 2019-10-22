import React from "react";

import * as TransactionsApi from "../../libraries/explorer-wamp/transactions";

import TransactionsList from "./TransactionsList";

export interface Props {
  accountId?: string;
  blockHash?: string;
  reversed: boolean;
  limit: number;
}

export interface State {
  transactions: TransactionsApi.Transaction[] | null;
}

export default class extends React.PureComponent<Props, State> {
  static defaultProps = {
    reversed: false,
    limit: 50
  };

  state: State = {
    transactions: null
  };

  componentDidMount() {
    this.fetchTransactions();
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props !== prevProps) {
      this.fetchTransactions();
    }
  }

  render() {
    const { transactions } = this.state;
    if (transactions === null) {
      return null;
    }
    return (
      <TransactionsList
        transactions={transactions}
        reversed={this.props.reversed}
      />
    );
  }

  fetchTransactions = async () => {
    const transactions = await TransactionsApi.getTransactions({
      signerId: this.props.accountId,
      receiverId: this.props.accountId,
      blockHash: this.props.blockHash,
      tail: this.props.reversed,
      limit: this.props.limit
    });
    this.setState({ transactions });
  };
}
