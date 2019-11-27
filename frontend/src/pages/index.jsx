import Head from "next/head";
import FlipMove from "react-flip-move";

import { Row, Col } from "react-bootstrap";

import BlocksApi from "../libraries/explorer-wamp/blocks";
import DetailsApi from "../libraries/explorer-wamp/details";
import TransactionsApi from "../libraries/explorer-wamp/transactions";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardTransactions from "../components/dashboard/DashboardTransactions";
import DashboardBlocks from "../components/dashboard/DashboardBlocks";
import Content from "../components/utils/Content";

export default class extends React.Component {
  static async getInitialProps({ req }) {
    const details = new DetailsApi(req).getDetails().catch(() => null);
    const blocks = new BlocksApi(req).getLatestBlocksInfo().catch(() => null);
    const transactions = new TransactionsApi(req)
      .getLatestTransactionsInfo()
      .catch(() => null);
    return {
      details: await details,
      blocks: await blocks,
      transactions: await transactions
    };
  }

  // componentDidMount() {
  //   this.regularFetchInfo();
  // }

  // componentWillUnmount() {
  //   clearTimeout(this.timer);
  //   this.timer = false;
  // }

  // fetchInfo = async () => {

  // };

  // regularFetchInfo = async () => {
  //   await this.fetchInfo();
  //   if (this.timer !== false) {
  //     this.timer = setTimeout(this.regularFetchInfo, 10000);
  //   }
  // };

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
