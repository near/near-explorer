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
  transactions: T.Transaction[];
  loading: Boolean;
}

export default class extends React.Component<Props, State> {
  static defaultProps = {
    reversed: false,
    limit: 15
  };

  state: State = {
    transactions: [],
    loading: true
  };

  _transactionsApi: TransactionsApi | null;
  timer: ReturnType<typeof setTimeout> | null;
  _transactionLoader: Element | null;

  constructor(props: Props) {
    super(props);
    this._transactionsApi = null;
    this.timer = null;
    this._transactionLoader = null;
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.accountId !== prevProps.accountId) {
      this.setState({ transactions: [] });
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
    let transactions;
    if (this.state.transactions.length === 0) {
      transactions = (await this._transactionsApi.getTransactions({
        signerId: this.props.accountId,
        receiverId: this.props.accountId,
        blockHash: this.props.blockHash,
        tail: this.props.reversed,
        limit: this.props.limit,
        offset: 0
      })) as T.Transaction[];
    } else {
      transactions = (await this._transactionsApi.getTransactions({
        signerId: this.props.accountId,
        receiverId: this.props.accountId,
        blockHash: this.props.blockHash,
        tail: this.props.reversed,
        limit: this.state.transactions.length,
        offset: 0
      })) as T.Transaction[];
    }
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
    const count = await this._getLength();
    console.log(count);
    if (count) {
      console.log(count);
      if (count <= this.state.transactions.length) {
        this.setState({ loading: false });
      } else {
        const bottom = this._isAtBottom();
        if (bottom && count > this.state.transactions.length) {
          document.removeEventListener("scroll", this._onScroll);
          await this._loadTransactions();
          this.setState({ loading: false });
          document.addEventListener("scroll", this._onScroll);
        }
      }
    }
  };

  _loadTransactions = async () => {
    await Promise.all([
      this.setState({ loading: true }),
      this._addTransactions()
    ]);
  };

  _addTransactions = async () => {
    if (this._transactionsApi === null) {
      this._transactionsApi = new TransactionsApi();
    }
    const transactions = (await this._transactionsApi.getTransactions({
      signerId: this.props.accountId,
      receiverId: this.props.accountId,
      blockHash: this.props.blockHash,
      tail: this.props.reversed,
      limit: this.props.limit,
      offset: this.state.transactions.length
    })) as T.Transaction[];
    const _transactions = this.state.transactions;
    const Transactions = _transactions.concat(transactions);
    this.setState({ transactions: Transactions });
  };

  _getLength = async () => {
    if (this._transactionsApi === null) {
      this._transactionsApi = new TransactionsApi();
    }
    return await this._transactionsApi.getTXLength(this.props.accountId);
  };

  render() {
    const { transactions, loading } = this.state;
    console.log(transactions);
    if (transactions === []) {
      return <PaginationSpinner hidden={false} />;
    }
    return (
      <div id="tx">
        <FlipMove duration={1000} staggerDurationBy={0}>
          <TransactionsList
            transactions={transactions}
            reversed={this.props.reversed}
          />
        </FlipMove>
        {loading && <PaginationSpinner hidden={false} />}
      </div>
    );
  }
}
