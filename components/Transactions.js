import Link from "next/link";

import { Container, Row, Col } from "react-bootstrap";

import Content from "./Content";
import TransactionsHeader from "./transactions/TransactionsHeader";

const Transactions = () => (
  <Content title="Transactions">
    <TransactionsHeader start="1" stop="10" total="254" />
  </Content>
);

export default Transactions;
