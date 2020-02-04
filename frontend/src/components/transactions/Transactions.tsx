import React from "react";

import TransactionsApi, * as T from "../../libraries/explorer-wamp/transactions";
import FlipMove from "../utils/FlipMove";
import PaginationSpinner from "../utils/PaginationSpinner";

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
  timer: ReturnType<typeof setTimeout> | null;

  constructor(props: Props) {
    super(props);

    // TODO: Design ExplorerApi to handle server-side rendering gracefully.
    this._transactionsApi = null;
    this.timer = null;
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.accountId !== prevProps.accountId) {
      this.setState({ transactions: null });
    }
  }

  componentDidMount() {
    this.timer = setTimeout(this.regularFetchInfo, 0);
  }

  componentWillUnmount() {
    clearTimeout(this.timer!);
    this.timer = null;
  }

  regularFetchInfo = async () => {
    await this.fetchTransactions();
    if (this.timer !== null) {
      this.timer = setTimeout(this.regularFetchInfo, 10000);
    }
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
      return <PaginationSpinner hidden={false} />;
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
