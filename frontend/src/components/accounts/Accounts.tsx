import React from "react";

import AccountsApi, * as A from "../../libraries/explorer-wamp/accounts";

import autoRefreshHandler from "../utils/autoRefreshHandler";
import PaginationSpinner from "../utils/PaginationSpinner";
import AccountsList from "./AccountsList";

export interface Props {
  Lists: A.AccountBasicInfo[];
}

const count = 15;

const fetchAccounts = async () => {
  return await new AccountsApi().getAccounts(count);
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
