import * as React from "react";

import FlipMove from "../utils/FlipMove";
import ListHandler from "../utils/ListHandler";
import Placeholder from "../utils/Placeholder";

import TransactionAction from "./TransactionAction";

import { useTranslation } from "react-i18next";
import { Fetcher } from "../../libraries/transport";
import { TransactionBaseInfo, TransactionPagination } from "../../types/common";

export interface OuterProps {
  accountId?: string;
  blockHash?: string;
  count?: number;
}

const TRANSACTIONS_PER_PAGE = 15;

const TransactionsWrapper: React.FC<OuterProps> = React.memo(
  ({ accountId, blockHash, count = TRANSACTIONS_PER_PAGE }) => {
    const fetchDataFn = React.useCallback(
      (
        fetcher: Fetcher,
        count: number,
        paginationIndexer: TransactionPagination | null
      ) => {
        if (accountId) {
          return fetcher("transactions-list-by-account-id", [
            accountId,
            count,
            paginationIndexer,
          ]);
        }
        if (blockHash) {
          return fetcher("transactions-list-by-block-hash", [
            blockHash,
            count,
            paginationIndexer,
          ]);
        }
        return fetcher("transactions-list", [count, paginationIndexer]);
      },
      [accountId, blockHash]
    );
    return (
      <TransactionsList
        key={accountId || blockHash}
        count={count}
        fetchDataFn={fetchDataFn}
      />
    );
  }
);

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

const TransactionsList = ListHandler({
  Component: Transactions,
  category: "Transaction",
  paginationIndexer: (items) => ({
    endTimestamp: items[items.length - 1].blockTimestamp,
    transactionIndex: items[items.length - 1].transactionIndex,
  }),
});

export default TransactionsWrapper;
