import { useEffect } from "react";

import { Row, Col } from "react-bootstrap";

import { DataConsumer } from "./utils/DataProvider";

import Content from "./Content";
import ActionRow from "./transactions/ActionRow";
import TransactionsHeader from "./transactions/TransactionsHeader";
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
          ctx.transactions.flatMap((transaction, transactionIndex) =>
            transaction.actions
              .reverse()
              .map((action, actionIndex) => (
                <ActionRow
                  key={transaction.hash + actionIndex}
                  transaction={transaction}
                  action={action}
                  cls={`${
                    ctx.transactions.length - 1 === transactionIndex &&
                    ctx.actions.length - 1 === actionIndex
                      ? "transaction-row-bottom"
                      : ""
                  }`}
                />
              ))
          )
        }
      </DataConsumer>
      <EmptyRow />
      <TransactionsPaginationFooter />
      <EmptyRow rows="5" />
    </Content>
  );
};

export default Transactions;
