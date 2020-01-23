import React from "react";

import AccountsApi, * as A from "../../libraries/explorer-wamp/accounts";

import AccountsList from "./AccountsList";
import PaginationSpinner from "../utils/PaginationSpinner";

export interface Props {}

export interface State {
  accounts: A.AccountBasicInfo[] | null;
}

export default class extends React.Component<Props, State> {
  state: State = {
    accounts: null
  };

  _accountApi: AccountsApi | null;

  constructor(props: Props) {
    super(props);
    this._accountApi = null;
  }

  fetchAccounts = async () => {
    if (this._accountApi === null) {
      this._accountApi = new AccountsApi();
    }
    const accounts = await this._accountApi.getAccounts();
    this.setState({ accounts });
  };

  componentDidMount() {
    this.fetchAccounts();
  }

  render() {
    const { accounts } = this.state;
    if (accounts === null) {
      return <PaginationSpinner hidden={false} />;
    }
    return <AccountsList accounts={accounts} />;
  }
}
