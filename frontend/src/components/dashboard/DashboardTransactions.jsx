import Link from "next/link";

import React from "react";

import TransactionIcon from "../../../public/static/images/icon-t-transactions.svg";

import { Row, Col } from "react-bootstrap";

import Content from "../utils/Content";
import TransactionsList from "../transactions/TransactionsList";
import TransactionsApi from "../../libraries/explorer-wamp/transactions";
import FlipMove from "../utils/FlipMove";

export default class extends React.Component {
  state = {
    transactions: this.props.transactions
  };

  componentDidMount() {
    this.regularFetchInfo();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    this.timer = null;
  }

  fetchInfo = async () => {
    const transactions = await new TransactionsApi()
      .getLatestTransactionsInfo(10)
      .catch(() => null);
    this.setState({ transactions });
  };

  regularFetchInfo = async () => {
    await this.fetchInfo();
    if (this.timer !== null) {
      this.timer = setTimeout(this.regularFetchInfo, 10000);
    }
  };

  render() {
    const { transactions } = this.state;
    return (
      <Content
        title={<h2>Recent Transactions</h2>}
        icon={<TransactionIcon style={{ width: "22px" }} />}
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
              <TransactionsList
                transactions={transactions}
                viewMode="compact"
                reversed
              />
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
    );
  }
}
