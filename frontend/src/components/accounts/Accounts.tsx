import * as React from "react";

import ListHandler from "../utils/ListHandler";
import FlipMove from "../utils/FlipMove";
import AccountRow from "./AccountRow";
import { useInfiniteQuery } from "../../hooks/use-infinite-query";

const ACCOUNTS_PER_PAGE = 15;

const Accounts: React.FC = React.memo(() => {
  const query = useInfiniteQuery(
    "accounts-list",
    { limit: ACCOUNTS_PER_PAGE },
    {
      getNextPageParam: (lastPage) => {
        const lastElement = lastPage[lastPage.length - 1];
        if (!lastElement) {
          return;
        }
        return lastElement.accountIndex;
      },
    }
  );
  return (
    <ListHandler query={query}>
      {(items) => (
        <FlipMove duration={1000} staggerDurationBy={0}>
          {items.map((account) => (
            <div key={account.accountId}>
              <AccountRow accountId={account.accountId} />
            </div>
          ))}
        </FlipMove>
      )}
    </ListHandler>
  );
});

export default Accounts;
