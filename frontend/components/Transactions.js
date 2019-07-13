import Link from "next/link";

import { Row, Col } from "react-bootstrap";

import Content from "./Content";
import TransactionsHeader from "./transactions/TransactionsHeader";
import TransactionsRow from "./transactions/TransactionsRow";
import TransactionsFooter from "./transactions/TransactionsFooter";
import EmptyRow from "./utils/EmptyRow";
import * as dummyData from "./utils/dummyData.json";

const Transactions = () => (
  <Content title="Transactions">
    <TransactionsHeader start="1" stop="10" total="254" />
    <EmptyRow />
    {dummyData.transactions.map((value, index, arr) => (
      <TransactionsRow
        key={index}
        txn={value}
        cls={`${arr.length - 1 === index ? "transaction-row-bottom" : ""}`}
      />
    ))}
    <EmptyRow />
    <TransactionsFooter start="1" stop="10" total="254" />
    <EmptyRow rows="5" />
  </Content>
);

export default Transactions;
