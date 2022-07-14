import * as React from "react";

import ListHandler from "../utils/ListHandler";
import FlipMove from "../utils/FlipMove";
import AccountRow from "./AccountRow";
import { trpc } from "../../libraries/trpc";
import { AccountListInfo } from "../../types/common";
import { id } from "../../libraries/common";

const ACCOUNTS_PER_PAGE = 15;

const Accounts: React.FC = React.memo(() => {
  const query = trpc.useInfiniteQuery(
    ["account.listByTimestamp", { limit: ACCOUNTS_PER_PAGE }],
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
    <ListHandler<AccountListInfo> query={query} parser={id}>
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
