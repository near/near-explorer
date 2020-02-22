import Head from "next/head";

import { Row, Col } from "react-bootstrap";

import BlocksApi from "../libraries/explorer-wamp/blocks";
import DetailsApi from "../libraries/explorer-wamp/details";
import TransactionsApi from "../libraries/explorer-wamp/transactions";

import Content from "../components/utils/Content";
import DashboardBlocks from "../components/dashboard/DashboardBlocks";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardTransactions from "../components/dashboard/DashboardTransactions";

export default class extends React.Component {
  static async getInitialProps({ req }) {
    const details = new DetailsApi(req).getDetails().catch(() => null);
    const blocks = new BlocksApi(req).getBlocks(8).catch(() => null);
    const transactions = new TransactionsApi(req)
      .getLatestTransactionsInfo(10)
      .catch(() => null);
    return {
      details: await details,
      blocks: await blocks,
      transactions: await transactions
    };
  }

  render() {
    const { details, transactions, blocks } = this.props;
    return (
      <>
        <Head>
          <title>Near Explorer | Dashboard</title>
        </Head>
        <Content title={<h1>Dashboard</h1>} border={false}>
          <DashboardHeader />
          <Row noGutters className="dashboard-section">
            <Col md="8">
              <DashboardTransactions transactions={transactions} />
            </Col>
            <Col md="4">
              <DashboardBlocks blocks={blocks} />
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
