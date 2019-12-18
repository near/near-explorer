import React from "react";

import AccountApi, * as A from "../../libraries/explorer-wamp/accounts";

import AccountsList from "./AccountsList";

export interface Props {}

export interface State {
  accounts: A.AccountId[] | null;
}

export default class extends React.Component<Props, State> {
  state: State = {
    accounts: null
  };

  _accountApi: AccountApi | null;

  constructor(props: Props) {
    super(props);
    this._accountApi = null;
  }

  fetchAccounts = async () => {
    if (this._accountApi === null) {
      this._accountApi = new AccountApi();
    }
    const accounts = await this._accountApi.getAccounts();
    this.setState({ accounts });
  };

  componentWillMount() {
    this.fetchAccounts();
  }

  render() {
    const { accounts } = this.state;
    if (accounts === null) {
      return null;
    }
    return <AccountsList accounts={accounts} />;
  }
}
