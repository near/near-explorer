import Link from "next/link";

import React from "react";
import { Row, Col } from "react-bootstrap";

import * as T from "../../libraries/explorer-wamp/transactions";
import { DatabaseConsumer } from "../../context/DatabaseProvider";

import Content from "../utils/Content";
import FlipMove from "../utils/FlipMove";

import TransactionAction from "../transactions/TransactionAction";

import TransactionIcon from "../../../public/static/images/icon-t-transactions.svg";

export default class extends React.Component {
  render() {
    return (
      <DatabaseConsumer>
        {(context) => (
          <Content
            title={<h2>Recent Transactions</h2>}
            icon={<TransactionIcon />}
            size="medium"
            border={false}
            className="dashboard-transactions"
          >
            <Row className="px-0">
              <Col xs="1" className="pr-0">
                <div className="dashboard-blocks-hr-parent">
                  <div className="dashboard-blocks-hr" />
                </div>
              </Col>
              <Col xs="11" className="px-0 dashboard-transactions-list">
                <FlipMove duration={1000} staggerDurationBy={0}>
                  {context.transactions.length > 0 &&
                    context.transactions.map((transaction: T.Transaction) => (
                      <TransactionAction
                        key={transaction.hash}
                        actions={transaction.actions}
                        transaction={transaction}
                        viewMode={"compact"}
                      />
                    ))}
                </FlipMove>
                <Row noGutters>
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
              .dashboard-transactions,
              .dashboard-transactions .content-header {
                padding: 0;
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
          </Content>
        )}
      </DatabaseConsumer>
    );
  }
}
