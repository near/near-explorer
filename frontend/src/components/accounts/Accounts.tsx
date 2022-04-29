import * as React from "react";

import ListHandler from "../utils/ListHandler";
import FlipMove from "../utils/FlipMove";
import AccountRow from "./AccountRow";
import { WampCall } from "../../libraries/wamp/api";
import { AccountListInfo } from "../../libraries/wamp/types";

const ACCOUNTS_PER_PAGE = 15;

const fetchDataFn = (
  wampCall: WampCall,
  count: number,
  paginationIndexer?: number
) => wampCall("accounts-list", [count, paginationIndexer]);

const AccountsWrapper: React.FC = React.memo(() => (
  <AccountsList count={ACCOUNTS_PER_PAGE} fetchDataFn={fetchDataFn} />
));

export default AccountsWrapper;

interface InnerProps {
  items: AccountListInfo[];
}

const Accounts: React.FC<InnerProps> = React.memo(({ items }) => (
  <FlipMove duration={1000} staggerDurationBy={0}>
    {items.map((account) => (
      <div key={account.accountId}>
        <AccountRow accountId={account.accountId} />
      </div>
    ))}
  </FlipMove>
));

const AccountsList = ListHandler({
  Component: Accounts,
  category: "Account",
  paginationIndexer: (items) => items[items.length - 1].accountIndex,
});
