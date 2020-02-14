import React from "react";

import AccountsApi, * as A from "../../libraries/explorer-wamp/accounts";

import AccountsList from "./AccountsList";
import PaginationSpinner from "../utils/PaginationSpinner";
import FlipMove from "../utils/FlipMove";

export interface Props {
  limit: number;
}

export interface State {
  accounts: A.AccountBasicInfo[];
  loading: Boolean;
}

export default class extends React.Component<Props, State> {
  static defaultProps = {
    limit: 15
  };

  state: State = {
    accounts: [],
    loading: true
  };

  _accountApi: AccountsApi | null;
  timer: ReturnType<typeof setTimeout> | null;
  _accountLoader: Element | null;

  constructor(props: Props) {
    super(props);
    this._accountApi = null;
    this.timer = null;
    this._accountLoader = null;
  }

  componentDidMount() {
    this._accountApi = new AccountsApi();
    document.addEventListener("scroll", this._onScroll);
    this.timer = setTimeout(this.regularFetchInfo, 0);
  }

  componentWillUnmount() {
    document.removeEventListener("scroll", this._onScroll);
    clearTimeout(this.timer!);
    this.timer = null;
  }

  regularFetchInfo = async () => {
    await this.fetchAccounts();
    if (this.timer !== null) {
      this.timer = setTimeout(this.regularFetchInfo, 10000);
    }
  };

  fetchAccounts = async () => {
    if (this._accountApi === null) {
      this._accountApi = new AccountsApi();
    }
    let accounts;
    if (this.state.accounts.length === 0) {
      accounts = await this._accountApi.getAccounts(this.props.limit, 0);
    } else {
      accounts = await this._accountApi.getAccounts(
        this.state.accounts.length,
        0
      );
    }
    this.setState({ accounts });
  };

  _isAtBottom = () => {
    return (
      this._accountLoader &&
      this._accountLoader.getBoundingClientRect().bottom <= window.innerHeight
    );
  };

  _onScroll = async () => {
    this._accountLoader = document.querySelector("#account");
    const bottom = this._isAtBottom();
    if (bottom) {
      document.removeEventListener("scroll", this._onScroll);
      await this._loadAccounts();
      this.setState({ loading: false });
      document.addEventListener("scroll", this._onScroll);
    }
  };

  _loadAccounts = async () => {
    const count = await this._getLength();
    if (count) {
      if (count <= this.state.accounts.length) {
        this.setState({ loading: false });
      } else {
        await Promise.all([
          this.setState({ loading: true }),
          this._addAccounts()
        ]);
      }
    }
  };

  _addAccounts = async () => {
    if (this._accountApi === null) {
      this._accountApi = new AccountsApi();
    }
    const accounts = await this._accountApi.getAccounts(
      this.props.limit,
      this.state.accounts.length
    );
    const _accounts = this.state.accounts;
    const Accounts = _accounts.concat(accounts);
    this.setState({ accounts: Accounts });
  };

  _getLength = async () => {
    if (this._accountApi === null) {
      this._accountApi = new AccountsApi();
    }
    const count = await this._accountApi.getAccountLength();
    return count;
  };

  render() {
    const { accounts, loading } = this.state;
    if (accounts === []) {
      return <PaginationSpinner hidden={false} />;
    }
    return (
      <>
        <div id="account">
          <FlipMove duration={1000} staggerDurationBy={0}>
            <AccountsList accounts={accounts} />
          </FlipMove>
        </div>
        {loading && <PaginationSpinner hidden={false} />}
      </>
    );
  }
}
