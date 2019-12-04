import React from "react";

import TransactionsApi, * as T from "../../libraries/explorer-wamp/transactions";
import FlipMove from "react-flip-move";

// import ActionRow, { ViewMode } from "../transactions/ActionRow";
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

export default class extends React.Component<Props, State> {
  static defaultProps = {
    reversed: false,
    limit: 15
  };

  state: State = {
    transactions: null
  };

  _transactionsApi: TransactionsApi | null;
  timer: any;

  constructor(props: Props) {
    super(props);

    // TODO: Design ExplorerApi to handle server-side rendering gracefully.
    this._transactionsApi = null;
    this.timer = null;
  }

  componentDidMount() {
    this.timer = setTimeout(this.regularFetchInfo, 0);
    this.regularFetchInfo();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    this.timer = null;
  }

  regularFetchInfo = async () => {
    if (this.state.transactions === null) {
      await this.fetchTransactions();
    } else {
      await this.fetchInfo();
    }
    if (this.timer !== null) {
      this.timer = setTimeout(this.regularFetchInfo, 10000);
    }
  };

  fetchInfo = async () => {
    if (this._transactionsApi === null) {
      this._transactionsApi = new TransactionsApi();
    }
    const transactions = await new TransactionsApi()
      .getLatestTransactionsInfo()
      .catch(() => null);
    this.setState({ transactions });
  };

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

  render() {
    const { transactions } = this.state;
    if (transactions === null) {
      return null;
    }
    return (
      <FlipMove duration={1000} staggerDurationBy={0}>
        <TransactionsList
          transactions={transactions}
          reversed={this.props.reversed}
        />
      </FlipMove>
    );
  }
}
