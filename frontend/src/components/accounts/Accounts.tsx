import React from "react";

import AccountsApi, * as A from "../../libraries/explorer-wamp/accounts";

import autoRefreshHandler from "../utils/autoRefreshHandler";
import PaginationSpinner from "../utils/PaginationSpinner";
import FlipMove from "../utils/FlipMove";
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
  render() {
    const { items } = this.props;
    let accountsShow = <PaginationSpinner hidden={false} />;
    if (items.length > 0) {
      accountsShow = (
        <FlipMove duration={1000} staggerDurationBy={0}>
          <AccountsList accounts={items} />
        </FlipMove>
      );
    }
    return <>{accountsShow}</>;
  }
}
