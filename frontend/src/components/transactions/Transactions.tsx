import * as React from "react";
import * as ReactQuery from "react-query";

import FlipMove from "../utils/FlipMove";
import ListHandler from "../utils/ListHandler";
import Placeholder from "../utils/Placeholder";

import TransactionAction from "./TransactionAction";

import { useTranslation } from "react-i18next";
import { TransactionBaseInfo } from "../../types/common";

export const getNextPageParam: ReactQuery.GetNextPageParamFunction<
  TransactionBaseInfo[]
> = (lastPage) => {
  const lastElement = lastPage[lastPage.length - 1];
  if (!lastElement) {
    return;
  }
  return {
    endTimestamp: lastElement.blockTimestamp,
    transactionIndex: lastElement.transactionIndex,
  };
};

interface Props {
  query: ReactQuery.UseInfiniteQueryResult<TransactionBaseInfo[], unknown>;
}

const Transactions: React.FC<Props> = React.memo(({ query }) => {
  const { t } = useTranslation();

  return (
    <ListHandler query={query}>
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
