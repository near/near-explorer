import React from "react";

import AccountsApi, * as A from "../../libraries/explorer-wamp/accounts";

import autoRefreshHandler from "../utils/autoRefreshHandler";
import FlipMove from "../utils/FlipMove";
import AccountRow from "./AccountRow";

export interface OuterProps {
  count: number;
}

export default class extends React.Component<OuterProps> {
  static defaultProps = {
    count: 15,
  };

  fetchAccounts = async (
    count: number,
    paginationIndexer?: A.AccountPagination
  ) => {
    return await new AccountsApi().getAccounts(count, paginationIndexer);
  };

  config = {
    fetchDataFn: this.fetchAccounts,
    count: this.props.count,
    category: "Account",
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
        {items &&
          items.map((account) => (
            <AccountRow
              key={account.id}
              accountId={account.id}
              createdAt={account.createdAtBlockTimestamp}
            />
          ))}
      </FlipMove>
    );
  }
}
