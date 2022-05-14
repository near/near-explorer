import * as React from "react";

import FlipMove from "../utils/FlipMove";
import ListHandler, { StaticConfig } from "../utils/ListHandler";
import Placeholder from "../utils/Placeholder";

import TransactionAction from "./TransactionAction";

import { useTranslation } from "react-i18next";
import { TransactionBaseInfo, TransactionPagination } from "../../types/common";

interface InnerProps {
  items: TransactionBaseInfo[];
}

const Transactions: React.FC<InnerProps> = React.memo(({ items }) => {
  const { t } = useTranslation();
  if (items?.length === 0) {
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
});

export type Props = {
  fetch: StaticConfig<TransactionBaseInfo, TransactionPagination>["fetch"];
};

const TransactionsList: React.FC<Props> = ({ fetch }) => {
  const Component = React.useMemo(
    () =>
      ListHandler({
        Component: Transactions,
        key: "Transaction",
        paginationIndexer: (lastPage) => {
          const lastElement = lastPage[lastPage.length - 1];
          if (!lastElement) {
            return;
          }
          return {
            endTimestamp: lastElement.blockTimestamp,
            transactionIndex: lastElement.transactionIndex,
          };
        },
        fetch,
      }),
    [fetch]
  );
  return <Component />;
};

export default TransactionsList;
