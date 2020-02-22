import Link from "next/link";
import React from "react";
import { Row, Col } from "react-bootstrap";

import TransactionIcon from "../../../public/static/images/icon-t-transactions.svg";
import TransactionsList from "../transactions/TransactionsList";
import TransactionsApi, * as T from "../../libraries/explorer-wamp/transactions";

import Content from "../utils/Content";
import FlipMove from "../utils/FlipMove";
import PaginationSpinner from "../utils/PaginationSpinner";
interface Props {}

interface State {
  transactions: T.Transaction[];
  limit: number;
}

export default class extends React.Component<Props, State> {
  state = {
    transactions: [],
    limit: 10
  };

  _transactionsApi: TransactionsApi | null;
  timer: ReturnType<typeof setTimeout> | null;

  constructor(props: Props) {
    super(props);
    this._transactionsApi = null;
    this.timer = null;
  }

  componentDidMount() {
    this.timer = setTimeout(this.regularFetchInfo, 0);
  }

  componentWillUnmount() {
    clearTimeout(this.timer!);
    this.timer = null;
  }

  fetchInfo = async () => {
    if (this._transactionsApi === null) {
      this._transactionsApi = new TransactionsApi();
    }
    this._transactionsApi
      .getLatestTransactionsInfo(this.state.limit)
      .then(transactions => {
        this.setState({ transactions });
      })
      .catch(err => console.error(err));
  };

  regularFetchInfo = async () => {
    await this.fetchInfo();
    if (this.timer !== null) {
      this.timer = setTimeout(this.regularFetchInfo, 10000);
    }
  };

  render() {
    const { transactions } = this.state;
    let txShow = <PaginationSpinner hidden={false} />;
    if (transactions.length > 0) {
      txShow = (
        <>
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
        </>
      );
    }
    return (
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
            {txShow}
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
