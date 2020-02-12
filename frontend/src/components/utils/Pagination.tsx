import React from "react";
import PaginationSpinner from "./PaginationSpinner";
import List, { GenreMode } from "./List";

import AccountsApi, * as A from "../../libraries/explorer-wamp/accounts";
import TransactionsApi, * as T from "../../libraries/explorer-wamp/transactions";

export interface Props {
  paginationSize: number;
  genre: GenreMode;
  reversed?: boolean;
  accountId?: string;
  blockHash?: string;
}

export interface State {
  lists: any;
  loading: Boolean;
  lastIndex: number;
}

//To have: api, lists, getlist function,

export default class extends React.Component<Props, State> {
  static defaultProps = {
    paginationSize: 15
  };

  state: State = {
    loading: false,
    lists: [],
    lastIndex: 0
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
    const count = await this._getLength();
    if (count && count <= this.state.lists.length) {
      this.setState({ loading: false });
    }
    if (count) {
      if (this.state.lists.length === 0) {
        await this.fetchLists(Math.min(this.props.paginationSize, count));
      } else {
        await this.fetchLists(this.state.lists.length);
      }
    } else {
      await this.fetchLists(this.state.lists.length);
    }
    if (this.timer !== null) {
      this.timer = setTimeout(this.regularFetchInfo, 10000);
    }
  };

  fetchLists = async (number: number) => {
    if (this.props.genre === "Account") {
      const lists = (await new AccountsApi().getAccounts(
        number
      )) as A.AccountBasicInfo[];
      if (lists.length > 0) {
        this.setState({ lists, lastIndex: lists[0].timestamp });
      }
    }
    if (this.props.genre === "Transaction") {
      const lists = (await new TransactionsApi().getTransactions({
        signerId: this.props.accountId,
        receiverId: this.props.accountId,
        blockHash: this.props.blockHash,
        tail: this.props.reversed,
        limit: number
      })) as T.Transaction[];
      if (lists.length > 0) {
        this.setState({ lists, lastIndex: lists[0].txHeight });
      }
    }
  };

  _isAtBottom = () => {
    return (
      this._Loader &&
      this._Loader.getBoundingClientRect().bottom <= window.innerHeight
    );
  };

  _onScroll = async () => {
    this._Loader = document.querySelector("#wrapper");
    const count = await this._getLength();
    const bottom =
      this._isAtBottom() && count && count > this.state.lists.length;
    if (bottom) {
      document.removeEventListener("scroll", this._onScroll);
      await this._loadLists();
      this.setState({ loading: false });
      document.addEventListener("scroll", this._onScroll);
    }
  };

  _loadLists = async () => {
    await Promise.all([this.setState({ loading: true }), this._addLists()]);
  };

  _addLists = async () => {
    if (this.props.genre === "Account") {
      const _lists = (await new AccountsApi().getAccounts(
        this.props.paginationSize,
        this.state.lastIndex
      )) as A.AccountBasicInfo[];
      if (_lists.length > 0) {
        const lists = this.state.lists;
        const List = _lists.concat(lists);
        this.setState({ lists: List, lastIndex: lists[0].timestamp });
      }
    }
    if (this.props.genre === "Transaction") {
      const _lists = (await new TransactionsApi().getTransactions({
        signerId: this.props.accountId,
        receiverId: this.props.accountId,
        blockHash: this.props.blockHash,
        tail: this.props.reversed,
        limit: this.props.paginationSize,
        lastTxHeight: this.state.lastIndex
      })) as T.Transaction[];
      if (_lists.length > 0) {
        const lists = this.state.lists;
        const List = _lists.concat(lists);
        this.setState({ lists: List, lastIndex: List[0].txHeight });
      }
    }
  };

  _getLength = async () => {
    if (this.props.genre === "Account") {
      const count = await new AccountsApi().getAccountLength();
      return count;
    }
    if (this.props.genre === "Transaction") {
      const count = await new TransactionsApi().getTXLength(
        this.props.accountId
      );
      return count;
    }
  };

  render() {
    const { lists, loading } = this.state;
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
