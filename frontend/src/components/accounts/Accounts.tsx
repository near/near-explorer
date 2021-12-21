import { FC } from "react";

import AccountsApi, * as A from "../../libraries/explorer-wamp/accounts";

import ListHandler from "../utils/ListHandler";
import FlipMove from "../utils/FlipMove";
import AccountRow from "./AccountRow";

const ACCOUNTS_PER_PAGE = 15;

const fetchDataFn = (count: number, paginationIndexer?: A.AccountPagination) =>
  new AccountsApi().getAccounts(count, paginationIndexer);

const AccountsWrapper: FC = () => (
  <AccountsList count={ACCOUNTS_PER_PAGE} fetchDataFn={fetchDataFn} />
);

export default AccountsWrapper;

interface InnerProps {
  items: A.PaginatedAccountBasicInfo[];
}

const Accounts: FC<InnerProps> = ({ items }) => (
  <FlipMove duration={1000} staggerDurationBy={0}>
    {items &&
      items.map((account) => (
        <div key={account.accountId}>
          <AccountRow accountId={account.accountId} />
        </div>
      ))}
  </FlipMove>
);

const AccountsList = ListHandler({
  Component: Accounts,
  category: "Account",
  paginationIndexer: (items) => ({
    endTimestamp: items[items.length - 1].createdAtBlockTimestamp
      ? items[items.length - 1].createdAtBlockTimestamp || undefined
      : undefined,
    accountIndex: items[items.length - 1].accountIndex,
  }),
});
