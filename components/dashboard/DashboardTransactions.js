import Link from "next/link";

import { Row, Col } from "react-bootstrap";

import { DataConsumer } from "../utils/DataProvider";

import DashboardTransactionsRow from "./DashboardTransactionsRow";

const EmptyRow = () => (
  <Row>
    <Col>&nbsp;</Col>
  </Row>
);

const DashboardTransactions = () => (
  <div>
    <EmptyRow />
    <Row noGutters="true">
      <Col xs="1" md="1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          viewBox="0 0 26 26"
        >
          <g
            fill="none"
            fillRule="evenodd"
            stroke="#CCC"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          >
            <path d="M7 19h18M7 25l-6-6 6-6M19 7H1M19 1l6 6-6 6" />
          </g>
        </svg>
      </Col>
      <Col className="dashboard-transactions-title">Recent Transactions</Col>
    </Row>
    <EmptyRow />
    <DataConsumer>
      {context => (
        <div>
          {context.transactions.map(transaction => {
            return (
              <DashboardTransactionsRow
                key={transaction.txId}
                txType={transaction.txType}
                txMsg={transaction.txMsg}
                txId={transaction.txId}
                contractName={transaction.contractName}
                username={transaction.username}
                created={transaction.created}
              />
            );
          })}
        </div>
      )}
    </DataConsumer>
    <Row>
      <Col xs="1" md="1" />
      <Col xs="6">
        <Link href="transactions">
          <a className="dashboard-footer">View All</a>
        </Link>
      </Col>
    </Row>
    <style jsx global>{`
      .dashboard-transactions-title {
        font-family: BwSeidoRound;
        font-size: 24px;
        font-weight: 500;
        color: #24272a;
      }
    `}</style>
  </div>
);

export default DashboardTransactions;
