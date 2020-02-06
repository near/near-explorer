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
  stop: number;
}

export default class extends React.Component<Props, State> {
  static defaultProps = {
    reversed: false,
    limit: 15
  };

  state: State = {
    transactions: null,
    stop: this.props.limit
  };

  _transactionsApi: TransactionsApi | null;
  timer: ReturnType<typeof setTimeout> | null;
  _transactionLoader: Element | null;

  constructor(props: Props) {
    super(props);

    // TODO: Design ExplorerApi to handle server-side rendering gracefully.
    this._transactionsApi = null;
    this.timer = null;
    this._transactionLoader = null;
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.accountId !== prevProps.accountId) {
      this.setState({ transactions: null });
    }
  }

  componentDidMount() {
    this._transactionsApi = new TransactionsApi();
    document.addEventListener("scroll", this._onScroll);
    this.timer = setTimeout(this.regularFetchInfo, 0);
  }

  componentWillUnmount() {
    document.removeEventListener("scroll", this._onScroll);
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
    const transactions = (await this._transactionsApi.getTransactions({
      signerId: this.props.accountId,
      receiverId: this.props.accountId,
      blockHash: this.props.blockHash,
      tail: this.props.reversed,
      limit: this.state.stop
    })) as T.Transaction[];
    this.setState({ transactions });
  };

  _isAtBottom = () => {
    return (
      this._transactionLoader &&
      this._transactionLoader.getBoundingClientRect().bottom <=
        window.innerHeight
    );
  };

  _onScroll = async () => {
    this._transactionLoader = document.querySelector("#tx");
    const bottom = this._isAtBottom();
    if (bottom) {
      document.removeEventListener("scroll", this._onScroll);
      await this._loadTransactions();
      document.addEventListener("scroll", this._onScroll);
    }
  };

  _loadTransactions = async () => {
    this.setState({ stop: this.state.stop + this.props.limit });
    await this.fetchTransactions();
  };

  render() {
    const { transactions } = this.state;
    console.log(this.state.stop);
    if (transactions === null) {
      return <PaginationSpinner hidden={false} />;
    }
    return (
      <>
        <div id="tx">
          <FlipMove duration={1000} staggerDurationBy={0}>
            <TransactionsList
              transactions={transactions}
              reversed={this.props.reversed}
            />
          </FlipMove>
        </div>
        <PaginationSpinner hidden={false} />
      </>
    );
  }
}
