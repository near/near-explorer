import * as React from "react";

import ListHandler from "../utils/ListHandler";
import FlipMove from "../utils/FlipMove";
import AccountRow from "./AccountRow";
import { AccountListInfo } from "../../types/common";

const ACCOUNTS_PER_PAGE = 15;

interface Props {
  items: AccountListInfo[];
}

const Accounts: React.FC<Props> = React.memo(({ items }) => (
  <FlipMove duration={1000} staggerDurationBy={0}>
    {items.map((account) => (
      <div key={account.accountId}>
        <AccountRow accountId={account.accountId} />
      </div>
    ))}
  </FlipMove>
));

const AccountsList = ListHandler<AccountListInfo, number>({
  Component: Accounts,
  key: "Account",
  paginationIndexer: (items) => items[items.length - 1].accountIndex,
  fetch: (fetcher, indexer) =>
    fetcher("accounts-list", [ACCOUNTS_PER_PAGE, indexer ?? null]),
});

export default AccountsList;
