import Head from "next/head";

import { useEffect, useContext } from "react";
import { Row, Col } from "react-bootstrap";

import * as BlocksApi from "../libraries/explorer-wamp/blocks";
import * as DetailsApi from "../libraries/explorer-wamp/details";
import * as TransactionsApi from "../libraries/explorer-wamp/transactions";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardTransactions from "../components/dashboard/DashboardTransactions";
import DashboardBlocks from "../components/dashboard/DashboardBlocks";
import Content from "../components/utils/Content";

export default class extends React.Component {
  static async getInitialProps() {
    const ignoreErr = promise => promise.catch(() => null);
    const details = ignoreErr(DetailsApi.getDetails());
    const blocks = ignoreErr(BlocksApi.getLatestBlocksInfo());
    const transactions = ignoreErr(TransactionsApi.getLatestTransactionsInfo());
    return {
      details: await details,
      blocks: await blocks,
      transactions: await transactions
    };
  }

  render() {
    return (
      <>
        <Head>
          <title>Near Explorer | Dashboard</title>
        </Head>
        <Content title={<h1>Dashboard</h1>} border={false}>
          <DashboardHeader {...this.props.details} />
          <Row noGutters className="dashboard-section">
            <Col md="8">
              <DashboardTransactions transactions={this.props.transactions} />
            </Col>
            <Col md="4">
              <DashboardBlocks blocks={this.props.blocks} />
            </Col>
          </Row>
          <style jsx global>{`
            .dashboard-section {
              margin-top: 1.5em;
            }
          `}</style>
        </Content>
      </>
    );
  }
}
