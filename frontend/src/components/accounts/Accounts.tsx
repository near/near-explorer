import * as React from "react";

import { AccountListInfo } from "@explorer/common/types/procedures";
import { id } from "@explorer/common/utils/utils";
import AccountRow from "@explorer/frontend/components/accounts/AccountRow";
import FlipMove from "@explorer/frontend/components/utils/FlipMove";
import ListHandler from "@explorer/frontend/components/utils/ListHandler";
import { trpc } from "@explorer/frontend/libraries/trpc";

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
    <ListHandler<"account.listByTimestamp", AccountListInfo>
      query={query}
      parser={id}
    >
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
