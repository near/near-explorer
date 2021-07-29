import { Component } from "react";

import AccountsApi, * as A from "../../libraries/explorer-wamp/accounts";

import ListHandler from "../utils/ListHandler";
import FlipMove from "../utils/FlipMove";
import AccountRow from "./AccountRow";

export interface OuterProps {
  count: number;
}

class AccountsWrapper extends Component<OuterProps> {
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

  AccountsList = ListHandler(Accounts, this.config);

  render() {
    return <this.AccountsList />;
  }
}

export default AccountsWrapper;

interface InnerProps extends OuterProps {
  items: A.AccountBasicInfo[];
}

class Accounts extends Component<InnerProps> {
  render() {
    const { items } = this.props;
    return (
      <FlipMove duration={1000} staggerDurationBy={0}>
        {items &&
          items.map((account) => (
            <AccountRow key={account.accountId} accountId={account.accountId} />
          ))}
      </FlipMove>
    );
  }
}
