import { FC, useCallback } from "react";

import TransactionsApi, * as T from "../../libraries/explorer-wamp/transactions";

import FlipMove from "../utils/FlipMove";
import ListHandler from "../utils/ListHandler";
import Placeholder from "../utils/Placeholder";

import TransactionAction from "./TransactionAction";

import { useTranslation } from "react-i18next";

export interface OuterProps {
  accountId?: string;
  blockHash?: string;
  count?: number;
}

const TRANSACTIONS_PER_PAGE = 15;

const TransactionsWrapper: FC<OuterProps> = ({
  accountId,
  blockHash,
  count = TRANSACTIONS_PER_PAGE,
}) => {
  const fetchDataFn = useCallback(
    (count: number, paginationIndexer?: T.TxPagination) => {
      if (accountId) {
        return new TransactionsApi().getAccountTransactionsList(
          accountId,
          count,
          paginationIndexer
        );
      }
      if (blockHash) {
        return new TransactionsApi().getTransactionsListInBlock(
          blockHash,
          count,
          paginationIndexer
        );
      }
      return new TransactionsApi().getTransactions(count, paginationIndexer);
    },
    [accountId, blockHash]
  );
  return (
    <TransactionsList
      key={accountId || blockHash}
      count={count}
      fetchDataFn={fetchDataFn}
      detailPage={accountId || blockHash ? true : false}
    />
  );
};

interface InnerProps {
  items: T.Transaction[];
}

const Transactions: FC<InnerProps> = ({ items }) => {
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
      {items &&
        items.map((transaction) => (
          <div key={transaction.hash}>
            <TransactionAction transaction={transaction} />
          </div>
        ))}
    </FlipMove>
  );
};

const TransactionsList = ListHandler({
  Component: Transactions,
  category: "Transaction",
  paginationIndexer: (items) => ({
    endTimestamp: items[items.length - 1].blockTimestamp,
    transactionIndex: items[items.length - 1].transactionIndex,
  }),
});

export default TransactionsWrapper;
