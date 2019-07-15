import Link from "next/link";

import { Row, Col } from "react-bootstrap";

import EmptyRow from "../utils/EmptyRow";
import { DataConsumer } from "../utils/DataProvider";

import DashboardTransactionsRow from "./DashboardTransactionsRow";

const DashboardTransactions = () => (
  <div>
    <EmptyRow />
    <Row>
      <Col xs="1" md="auto" className="dashboard-transactions-icon-col">
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
      <Col className="px-md-0 dashboard-transactions-title">
        Recent Transactions
      </Col>
    </Row>
    <Row>
      <Col xs="1" md="auto" className="pr-0">
        <div className="dashboard-blocks-hr-parent">
          <div className="dashboard-blocks-hr" />
        </div>
      </Col>
      <Col className="px-0 dashboard-transactions-border">
        <DataConsumer>
          {context => (
            <div>
              {context.transactions.map(transaction => {
                return (
                  <DashboardTransactionsRow
                    key={transaction.hash}
                    txHash={transaction.hash}
                    txKind={transaction.kind}
                    txArgs={transaction.args}
                    txOriginator={transaction.originator}
                    txStatus={transaction.status}
                    blockTimestamp={transaction.blockTimestamp}
                  />
                );
              })}
            </div>
          )}
        </DataConsumer>
        <Row noGutters="true">
          <Col xs="1" className="dashboard-transactions-icon-col" />
          <Col xs="6">
            <Link href="transactions">
              <a className="dashboard-footer">View All</a>
            </Link>
          </Col>
        </Row>
      </Col>
    </Row>
    <style jsx global>{`
      .dashboard-transactions-title {
        font-family: BwSeidoRound;
        font-size: 24px;
        font-weight: 500;
        color: #24272a;
      }

      .dashboard-transactions-border {
        padding-top: 15px;
      }

      @media (max-width: 499px) {
        .dashboard-transactions-border {
          margin-left: -3.5%;
        }
      }

      @media (min-width: 500px) {
        .dashboard-transactions-border {
          margin-left: -4.5%;
        }
      }

      @media (min-width: 680px) {
        .dashboard-transactions-border {
          margin-left: -5.4%;
        }
      }

      @media (min-width: 768px) {
        .dashboard-transactions-border {
          margin-left: -5.4%;
        }
      }

      @media (min-width: 992px) {
        .dashboard-transactions-icon-col {
          flex: 0 0 5%;
        }

        .dashboard-transactions-border {
          margin-left: -3.75%;
        }
      }

      @media (min-width: 1200px) {
        .dashboard-transactions-border {
          margin-left: -3.23%;
        }
      }
    `}</style>
  </div>
);

export default DashboardTransactions;
