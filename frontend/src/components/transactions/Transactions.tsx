import * as React from "react";

import { useTranslation } from "next-i18next";
import * as ReactQuery from "react-query";

import {
  TransactionPreview,
  TransactionListResponse,
} from "@explorer/common/types/procedures";
import TransactionAction from "@explorer/frontend/components/transactions/TransactionAction";
import FlipMove from "@explorer/frontend/components/utils/FlipMove";
import ListHandler from "@explorer/frontend/components/utils/ListHandler";
import Placeholder from "@explorer/frontend/components/utils/Placeholder";

export const getNextPageParam: ReactQuery.GetNextPageParamFunction<
  TransactionListResponse
> = (lastPage) => lastPage.cursor;

const parser = (result: TransactionListResponse) => result.items;

interface Props {
  query: ReactQuery.UseInfiniteQueryResult<TransactionListResponse, unknown>;
}

const Transactions: React.FC<Props> = React.memo(({ query }) => {
  const { t } = useTranslation();

  return (
    <ListHandler<TransactionPreview, TransactionListResponse>
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
              <div key={transaction.hash}>
                <TransactionAction transaction={transaction} />
              </div>
            ))}
          </FlipMove>
        );
      }}
    </ListHandler>
  );
});

export default Transactions;
