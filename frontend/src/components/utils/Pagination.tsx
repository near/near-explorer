import React from "react";
import PaginationSpinner from "./PaginationSpinner";
import List, { GenreMode } from "./List";

import AccountsApi from "../../libraries/explorer-wamp/accounts";
import TransactionsApi from "../../libraries/explorer-wamp/transactions";

export interface Props {
  limit: number;
  genre: GenreMode;
  reversed?: boolean;
  accountId?: string;
  blockHash?: string;
}

export interface State {
  lists: any;
  loading: Boolean;
}

//To have: api, lists, getlist function,

export default class extends React.Component<Props, State> {
  static defaultProps = {
    limit: 15
  };

  state: State = {
    loading: false,
    lists: []
  };

  timer: ReturnType<typeof setTimeout> | null;
  _Loader: Element | null;

  constructor(props: Props) {
    super(props);
    this.timer = null;
    this._Loader = null;
  }

  componentDidMount() {
    document.addEventListener("scroll", this._onScroll);
    this.timer = setTimeout(this.regularFetchInfo, 0);
  }

  componentWillUnmount() {
    document.removeEventListener("scroll", this._onScroll);
    clearTimeout(this.timer!);
    this.timer = null;
  }

  regularFetchInfo = async () => {
    if (this.state.lists.length === 0) {
      await this.fetchAccounts(this.props.limit);
    } else {
      await this.fetchAccounts(this.state.lists.length);
    }

    if (this.timer !== null) {
      this.timer = setTimeout(this.regularFetchInfo, 10000);
    }
  };

  fetchAccounts = async (number: number) => {
    let lists;
    if (this.props.genre === "Account") {
      lists = await new AccountsApi().getAccounts(number);
    }
    if (this.props.genre === "Transaction") {
      lists = await new TransactionsApi().getTransactions({
        signerId: this.props.accountId,
        receiverId: this.props.accountId,
        blockHash: this.props.blockHash,
        tail: this.props.reversed,
        limit: number
      });
    }
    this.setState({ lists });
  };

  _isAtBottom = () => {
    return (
      this._Loader &&
      this._Loader.getBoundingClientRect().bottom <= window.innerHeight
    );
  };

  _onScroll = async () => {
    this._Loader = document.querySelector("#wrapper");
    const bottom = this._isAtBottom();
    if (bottom) {
      document.removeEventListener("scroll", this._onScroll);
      await this._loadAccounts();
      this.setState({ loading: false });
      document.addEventListener("scroll", this._onScroll);
    }
  };

  _loadAccounts = async () => {
    await Promise.all([
      this.setState({ loading: true }),
      this.fetchAccounts(this.state.lists.length + this.props.limit)
    ]);
  };

  _getLength = async () => {
    let count;
    if (this.props.genre === "Account") {
      count = await new AccountsApi().getAccountLength();
    }
    if (this.props.genre === "Transaction") {
      if (this.props.accountId) {
        count = await new TransactionsApi().getTXLength(this.props.accountId);
      }
    }
    if (count && count <= this.state.lists.length) {
      this.setState({ loading: false });
    }
  };

  render() {
    const { lists, loading } = this.state;
    console.log(lists);
    if (lists === []) {
      return <PaginationSpinner hidden={false} />;
    }
    return (
      <>
        <div id="wrapper">
          <List lists={lists} {...this.props} />
        </div>
        {loading && <PaginationSpinner hidden={false} />}
      </>
    );
  }
}
