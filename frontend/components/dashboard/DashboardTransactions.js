import Link from "next/link";

import { Container, Row, Col } from "react-bootstrap";

import ActionRow from "../transactions/ActionRow";
import EmptyRow from "../utils/EmptyRow";
import { DataConsumer } from "../utils/DataProvider";

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
      <Col xs="11" md="11" className="px-0 dashboard-transactions-list">
        <DataConsumer>
          {ctx =>
            ctx.transactions.flatMap((transaction, transactionIndex) =>
              transaction.actions
                .reverse()
                .map((action, actionIndex) => (
                  <ActionRow
                    key={transaction.hash + actionIndex}
                    viewMode="compact"
                    transaction={transaction}
                    action={action}
                    className={
                      ctx.transactions.length - 1 === transactionIndex &&
                      transaction.actions.length - 1 === actionIndex
                        ? "transaction-row-bottom"
                        : ""
                    }
                  />
                ))
            )
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

      .dashboard-transactions-list {
        padding-top: 15px !important;
      }

      @media (max-width: 499px) {
        .dashboard-transactions-list {
          margin-left: -3.5% !important;
        }
      }

      @media (min-width: 500px) {
        .dashboard-transactions-list {
          margin-left: -4.5% !important;
        }
      }

      @media (min-width: 680px) {
        .dashboard-transactions-list {
          margin-left: -5.4% !important;
        }
      }

      @media (min-width: 768px) {
        .dashboard-transactions-list {
          margin-left: -5.4% !important;
        }
      }

      @media (min-width: 992px) {
        .dashboard-transactions-icon-col,
        .dashboard-transactions-list .transactions-icon-col {
          flex: 0 0 5% !important;
        }

        .dashboard-transactions-list {
          margin-left: -3.75% !important;
        }
      }

      @media (min-width: 1200px) {
        .dashboard-transactions-list {
          margin-left: -6.23% !important;
        }
      }
    `}</style>
  </div>
);

export default DashboardTransactions;
