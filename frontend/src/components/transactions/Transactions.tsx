import * as React from "react";

import type * as ReactQuery from "@tanstack/react-query";
import { useTranslation } from "next-i18next";

import { TransactionListResponse } from "@/common/types/procedures";
import { TRPCInfiniteQueryResult } from "@/common/types/trpc";
import { TransactionAction } from "@/frontend/components/transactions/TransactionAction";
import { FlipMove } from "@/frontend/components/utils/FlipMove";
import { ListHandler } from "@/frontend/components/utils/ListHandler";
import { Placeholder } from "@/frontend/components/utils/Placeholder";

export const getNextPageParam: ReactQuery.GetNextPageParamFunction<
  TransactionListResponse
> = (lastPage) => lastPage.cursor;

const parser = (result: TransactionListResponse) => result.items;

interface Props {
  query: TRPCInfiniteQueryResult<
    | "transaction.listByAccountId"
    | "transaction.listByTimestamp"
    | "transaction.listByBlockHash"
  >;
}

export const Transactions: React.FC<Props> = React.memo(({ query }) => {
  const { t } = useTranslation();

  return (
    <ListHandler<
      | "transaction.listByAccountId"
      | "transaction.listByTimestamp"
      | "transaction.listByBlockHash",
      TransactionListResponse["items"][number]
    >
      query={query}
      parser={parser}
    >
      {(items) => {
        if (items.length === 0) {
          return (
            <Placeholder>
              {t("component.transactions.Transactions.no_transactions")}
            </Placeholder>
          );
        }
        return (
          <FlipMove duration={1000} staggerDurationBy={0}>
            {items.map((transaction) => (
              <div key={transaction.hash} data-testid="transaction-item">
                <TransactionAction transaction={transaction} />
              </div>
            ))}
          </FlipMove>
        );
      }}
    </ListHandler>
  );
});
