import React from "react";

import AccountsApi, * as A from "../../libraries/explorer-wamp/accounts";

import autoRefreshHandler from "../utils/autoRefreshHandler";
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

  config = {
    fetchDataFn: this.fetchAccounts,
    count: this.props.count,
    categary: "Account"
  };

  autoRefreshAccounts = autoRefreshHandler(Accounts, this.config);

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
    return (
      <FlipMove duration={1000} staggerDurationBy={0}>
        <AccountsList accounts={items} />
      </FlipMove>
    );
  }
}
