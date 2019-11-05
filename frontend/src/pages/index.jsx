import Head from "next/head";

import {Row, Col} from "react-bootstrap";

import BlocksApi from "../libraries/explorer-wamp/blocks";
import DetailsApi from "../libraries/explorer-wamp/details";
import TransactionsApi from "../libraries/explorer-wamp/transactions";

import DashboardTransactions from "../components/dashboard/DashboardTransactions";
import DashboardBlocks from "../components/dashboard/DashboardBlocks";
import Content from "../components/utils/Content";
import {DashboardHeader} from "../components/dashboard/DashboardHeader";

export default class extends React.Component {
  static async getInitialProps({req}) {
    const ignoreErr = promise => promise.catch(() => null);
    const details = ignoreErr(new DetailsApi(req).getDetails());
    const blocks = ignoreErr(new BlocksApi(req).getLatestBlocksInfo());

    const transactions = ignoreErr(
      new TransactionsApi(req).getLatestTransactionsInfo()
    );

    return {
      details: await details,
      blocks: await blocks,
      transactions: await transactions,
      req: req
    };
  }

  render() {
    return (
      <>
        <Head>
          <title>Near Explorer | Dashboard</title>
        </Head>
        <Content title={<h1>Dashboard</h1>} border={false}>
          <DashboardHeader {...this.props} />
          <Row noGutters className="dashboard-section">
            <Col md="8">
              <DashboardTransactions transactions={this.props.transactions}/>
            </Col>
            <Col md="4">
              <DashboardBlocks blocks={this.props.blocks}/>
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
