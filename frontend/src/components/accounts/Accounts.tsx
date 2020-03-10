import React from "react";

import AccountsApi, * as A from "../../libraries/explorer-wamp/accounts";

import autoRefreshHandler from "../utils/autoRefreshHandler";
import AccountsList from "./AccountsList";

export interface OuterProps {
  count: number;
}

export default class extends React.Component<OuterProps> {
  static defaultProps = {
    count: 15
  };

  fetchAccounts = async () => {
    return await new AccountsApi().getAccounts(this.props.count);
  };

  autoRefreshAccounts = autoRefreshHandler(Accounts, this.fetchAccounts);

  render() {
    return <this.autoRefreshAccounts />;
  }
}

interface InnerProps {
  items: A.AccountBasicInfo[];
}
class Accounts extends React.Component<InnerProps> {
  static defaultProps = {
    items: []
  };

  render() {
    const { items } = this.props;
    return <AccountsList accounts={items} />;
  }
}
