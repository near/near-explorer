import React from "react";

import AccountsApi, * as A from "../../libraries/explorer-wamp/accounts";

import autoRefreshHandler from "../utils/autoRefreshHandler";

import AccountsList from "./AccountsList";
import PaginationSpinner from "../utils/PaginationSpinner";

export interface Props {
  Lists: A.AccountBasicInfo[];
}

const fetchAccounts = async () => {
  return await new AccountsApi().getAccounts();
};

class Accounts extends React.Component<Props> {
  static defaultProps = {
    Lists: []
  };

  render() {
    const { Lists } = this.props;
    if (Lists.length === 0) {
      return <PaginationSpinner hidden={false} />;
    }
    return <AccountsList accounts={Lists} />;
  }
}

export default autoRefreshHandler(Accounts, fetchAccounts);
