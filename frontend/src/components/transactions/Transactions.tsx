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
  stop: number | null;
}

export default class extends React.Component<Props, State> {
  static defaultProps = {
    reversed: false,
    limit: 15
  };

  state: State = {
    transactions: null,
    stop: null
  };

  _transactionsApi: TransactionsApi | null;
  timer: ReturnType<typeof setTimeout> | null;
  _blockLoader: Element | null;

  constructor(props: Props) {
    super(props);

    // TODO: Design ExplorerApi to handle server-side rendering gracefully.
    this._transactionsApi = null;
    this.timer = null;
    this._blockLoader = null;
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
    this.setState({ transactions, stop: transactions[0].blockHeight });
  };

  _isAtBottom = () => {
    if (this._blockLoader !== null) {
      return (
        this._blockLoader.getBoundingClientRect().bottom <= window.innerHeight
      );
    } else {
      return false;
    }
  };

  _onScroll = async () => {
    this._blockLoader = document.getElementById("tx");
    const bottom = this._isAtBottom();
    if (bottom) {
      await this._loadTransactions();
      document.addEventListener("scroll", this._onScroll);
    }
    // Add the listener again.
    document.addEventListener("scroll", this._onScroll);
  };

  _loadTransactions = async () => {
    if (this.state.stop === null) {
      console.log("first fetch");
      await this.fetchTransactions();
    } else {
      console.log("get next fetch");
      await this._getNextBatch(this.state.stop);
    }
  };

  _getNextBatch = async (stop: number) => {
    try {
      if (this._transactionsApi === null) {
        this._transactionsApi = new TransactionsApi();
      }
      this._transactionsApi
        .getTransactions({
          signerId: this.props.accountId,
          receiverId: this.props.accountId,
          blockHash: this.props.blockHash,
          tail: this.props.reversed,
          limit: this.props.limit,
          stop
        })
        .then(res => console.log(res));
      // if (transactions.length > 0) {
      //   this.setState(preState => {
      //    let _transaction = transactions.push(preState.transactions)
      //    return {transactions: _transaction}
      //   })
      // }
    } catch (err) {
      console.error("Blocks.getNextBatch failed to fetch data due to:");
      console.error(err);
    }
  };

  render() {
    const { transactions } = this.state;
    if (transactions === null) {
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
      </div>
    );
  }
}
