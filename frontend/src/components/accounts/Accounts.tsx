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

  fetchAccounts = async (count: number, endTimestamp?: number) => {
    return await new AccountsApi().getAccounts(count, endTimestamp);
  };

  autoRefreshAccounts = autoRefreshHandler(
    Accounts,
    this.fetchAccounts,
    this.props.count,
    true
  );

  render() {
    return <this.autoRefreshAccounts />;
  }
}

interface InnerProps extends OuterProps {
  items: A.AccountBasicInfo[];
}

class Accounts extends React.Component<InnerProps> {
  render() {
    const { items } = this.props;
    if (items.length === 0) {
      return <PaginationSpinner hidden={false} />;
    }
    return (
      <FlipMove duration={1000} staggerDurationBy={0}>
        <AccountsList accounts={items} />
      </FlipMove>
    );
  }
}
