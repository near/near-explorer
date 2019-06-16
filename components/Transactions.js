import Link from "next/link";

import { Container, Row, Col } from "react-bootstrap";

import Content from "./Content";
import TransactionsHeader from "./transactions/TransactionsHeader";
import TransactionsRow from "./transactions/TransactionsRow";
import EmptyRow from "./utils/EmptyRow";
import * as dummyData from "./utils/dummyData.json";

const Transactions = () => (
  <Content title="Transactions">
    <TransactionsHeader start="1" stop="10" total="254" />
    <EmptyRow />
    {dummyData.transactions.map(value => (
      <TransactionsRow txn={value} />
    ))}
  </Content>
);

export default Transactions;
