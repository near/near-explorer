import React from "react";

import TransactionsApi, * as T from "../../libraries/explorer-wamp/transactions";

import TransactionsList from "./TransactionsList";

export interface Props {
  accountId?: string;
  blockHash?: string;
  reversed: boolean;
  limit: number;
}

export interface State {
  transactions: T.Transaction[] | null;
}

export default class extends React.PureComponent<Props, State> {
  static defaultProps = {
    reversed: false,
    limit: 50
  };

  state: State = {
    transactions: null
  };

  _transactionsApi: TransactionsApi | null;

  constructor(props: Props) {
    super(props);

    // TODO: Design ExplorerApi to handle server-side rendering gracefully.
    this._transactionsApi = null;
  }

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
    if (this._transactionsApi === null) {
      this._transactionsApi = new TransactionsApi();
    }
    const transactions = await this._transactionsApi.getTransactions({
      signerId: this.props.accountId,
      receiverId: this.props.accountId,
      blockHash: this.props.blockHash,
      tail: this.props.reversed,
      limit: this.props.limit
    });
    this.setState({ transactions });
  };
}
