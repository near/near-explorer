import { useEffect } from "react";

import { Row, Col } from "react-bootstrap";

import { DataConsumer } from "./utils/DataProvider";

import Content from "./Content";
import TransactionsHeader from "./transactions/TransactionsHeader";
import TransactionsRow from "./transactions/TransactionsRow";
import TransactionsPaginationFooter from "./transactions/TransactionsPaginationFooter";
import EmptyRow from "./utils/EmptyRow";

const Transactions = () => {
  useEffect(() => {
    // TODO: update the pagination for transactions.
  }, []);

  return (
    <Content title="Transactions">
      <TransactionsHeader />
      <EmptyRow />
      <DataConsumer>
        {ctx =>
          ctx.transactions.map((transaction, index) => (
            <TransactionsRow
              key={transaction.hash}
              txn={transaction}
              cls={`${
                ctx.transactions.length - 1 === index
                  ? "transaction-row-bottom"
                  : ""
              }`}
            />
          ))
        }
      </DataConsumer>
      <EmptyRow />
      <TransactionsPaginationFooter />
      <EmptyRow rows="5" />
    </Content>
  );
};

export default Transactions;
