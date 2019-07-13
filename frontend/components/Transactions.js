import Link from "next/link";

import { Row, Col } from "react-bootstrap";

import { DataConsumer } from "./utils/DataProvider";

import Content from "./Content";
import TransactionsHeader from "./transactions/TransactionsHeader";
import TransactionsRow from "./transactions/TransactionsRow";
import TransactionsFooter from "./transactions/TransactionsFooter";
import EmptyRow from "./utils/EmptyRow";

const Transactions = () => (
  <Content title="Transactions">
    <TransactionsHeader start="1" stop="10" total="254" />
    <EmptyRow />
    <DataConsumer>
      {context =>
        context.transactions.map((transaction, index) => (
          <TransactionsRow
            key={transaction.hash}
            txn={transaction}
            cls={`${
              context.transactions.length - 1 === index
                ? "transaction-row-bottom"
                : ""
            }`}
          />
        ))
      }
    </DataConsumer>
    <EmptyRow />
    <TransactionsFooter start="1" stop="10" total="254" />
    <EmptyRow rows="5" />
  </Content>
);

export default Transactions;
