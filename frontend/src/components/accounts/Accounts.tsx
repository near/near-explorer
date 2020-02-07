import React from "react";

import AccountsApi, * as A from "../../libraries/explorer-wamp/accounts";

import AccountsList from "./AccountsList";
import PaginationSpinner from "../utils/PaginationSpinner";
import FlipMove from "../utils/FlipMove";

export interface Props {
  limit: number;
}

export interface State {
  accounts: A.AccountBasicInfo[] | null;
  stop: number;
  loading: Boolean;
}

export default class extends React.Component<Props, State> {
  static defaultProps = {
    limit: 15
  };

  state: State = {
    accounts: null,
    loading: false,
    stop: this.props.limit
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
    const accounts = await this._accountApi.getAccounts(this.state.stop);
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
      document.addEventListener("scroll", this._onScroll);
    }
  };

  _loadAccounts = async () => {
    this.setState({ stop: this.state.stop + this.props.limit, loading: true });
    await this.fetchAccounts();
    this.setState({ loading: false });
  };

  _getLength = async () => {
    if (this._accountApi === null) {
      this._accountApi = new AccountsApi();
    }
    const count = await this._accountApi.getAccountLength();
    if (count <= this.state.stop) {
      this.setState({ loading: false });
    }
  };

  render() {
    const { accounts, loading } = this.state;
    if (accounts === null) {
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
