import React from "react";

import AccountsApi, * as A from "../../libraries/explorer-wamp/accounts";

import autoRefreshHandler from "../utils/autoRefreshHandler";
import PaginationSpinner from "../utils/PaginationSpinner";
import AccountsList from "./AccountsList";

export interface Props {
  items: A.AccountBasicInfo[];
}

const count = 15;

const fetchAccounts = async () => {
  return await new AccountsApi().getAccounts(count);
};

class Accounts extends React.Component<Props> {
  static defaultProps = {
    items: []
  };

  render() {
    const { items } = this.props;
    if (items.length === 0) {
      return <PaginationSpinner hidden={false} />;
    }
    return <AccountsList accounts={items} />;
  }
}

export default autoRefreshHandler(Accounts, fetchAccounts);
