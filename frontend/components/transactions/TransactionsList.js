import { useEffect } from "react";

import { Row, Col } from "react-bootstrap";

import { DataConsumer } from "../utils/DataProvider";
import EmptyRow from "../utils/EmptyRow";

import ActionRow from "./ActionRow";
import TransactionsHeader from "./TransactionsHeader";
import TransactionsPaginationFooter from "./TransactionsPaginationFooter";

const Transactions = ({ transactions }) => {
  return (
    <>
      <TransactionsHeader />
      <EmptyRow />
      {transactions.flatMap((transaction, transactionIndex) =>
        transaction.actions
          .reverse()
          .map((action, actionIndex) => (
            <ActionRow
              key={transaction.hash + actionIndex}
              transaction={transaction}
              action={action}
              cls={`${
                transactions.length - 1 === transactionIndex &&
                transaction.actions.length - 1 === actionIndex
                  ? "transaction-row-bottom"
                  : ""
              }`}
            />
          ))
      )}
      <EmptyRow />
      <TransactionsPaginationFooter />
      <EmptyRow rows="5" />
    </>
  );
};

export default Transactions;
