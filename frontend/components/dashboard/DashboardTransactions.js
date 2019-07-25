import Link from "next/link";

import { Container, Row, Col } from "react-bootstrap";

import EmptyRow from "../utils/EmptyRow";
import { DataConsumer } from "../utils/DataProvider";

import DashboardTransactionsRow from "./DashboardTransactionsRow";

const DashboardTransactions = () => (
  <div>
    <EmptyRow />
    <Row>
      <Col xs="1" md="auto" className="dashboard-transactions-icon-col">
        <img
          src="/static/images/icon-t-transactions.svg"
          style={{ width: "22px" }}
        />
      </Col>
      <Col className="px-md-0 dashboard-transactions-title">
        Recent Transactions
      </Col>
    </Row>
    <Row>
      <Col xs="1" md="1" className="pr-0">
        <div className="dashboard-blocks-hr-parent">
          <div className="dashboard-blocks-hr" />
        </div>
      </Col>
      <Col xs="11" md="11" className="px-0 dashboard-transactions-border">
        <DataConsumer>
          {ctx =>
            ctx.transactions.map(transaction => (
              <DashboardTransactionsRow
                key={transaction.hash}
                txHash={transaction.hash}
                txKind={transaction.kind}
                txArgs={transaction.args}
                txMsg={transaction.msg}
                txOriginator={transaction.originator}
                txStatus={transaction.status}
                blockTimestamp={transaction.blockTimestamp}
              />
            ))
          }
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
        padding-top: 15px !important;
      }

      @media (max-width: 499px) {
        .dashboard-transactions-border {
          margin-left: -3.5% !important;
        }
      }

      @media (min-width: 500px) {
        .dashboard-transactions-border {
          margin-left: -4.5% !important;
        }
      }

      @media (min-width: 680px) {
        .dashboard-transactions-border {
          margin-left: -5.4% !important;
        }
      }

      @media (min-width: 768px) {
        .dashboard-transactions-border {
          margin-left: -5.4% !important;
        }
      }

      @media (min-width: 992px) {
        .dashboard-transactions-icon-col {
          flex: 0 0 5% !important;
        }

        .dashboard-transactions-border {
          margin-left: -3.75% !important;
        }
      }

      @media (min-width: 1200px) {
        .dashboard-transactions-border {
          margin-left: -6.23% !important;
        }
      }
    `}</style>
  </div>
);

export default DashboardTransactions;
