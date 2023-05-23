import * as React from "react";

import { id } from "@/common/utils/utils";
import AccountRow from "@/frontend/components/accounts/AccountRow";
import FlipMove from "@/frontend/components/utils/FlipMove";
import ListHandler from "@/frontend/components/utils/ListHandler";
import { trpc } from "@/frontend/libraries/trpc";

const ACCOUNTS_PER_PAGE = 15;

const Accounts: React.FC = React.memo(() => {
  const query = trpc.account.listByTimestamp.useInfiniteQuery(
    { limit: ACCOUNTS_PER_PAGE },
    {
      getNextPageParam: (lastPage) => {
        const lastElement = lastPage[lastPage.length - 1];
        if (!lastElement) {
          return;
        }
        return { index: lastElement.index };
      },
    }
  );
  return (
    <ListHandler<"account.listByTimestamp"> query={query} parser={id}>
      {(items) => (
        <FlipMove duration={1000} staggerDurationBy={0}>
          {items.map((account) => (
            <AccountRow key={account.id} account={account} />
          ))}
        </FlipMove>
      )}
    </ListHandler>
  );
});

export default Accounts;
