import Head from "next/head";

import { Row, Col } from "react-bootstrap";

import NodeStatsProvider from "../context/NodeStatsProvider";
import ListProvider from "../context/ListProvider";

import Content from "../components/utils/Content";
import DashboardBlocks from "../components/dashboard/DashboardBlocks";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardTransactions from "../components/dashboard/DashboardTransactions";

export default class extends React.Component {
  render() {
    const { name } = this.props.currentNearNetwork;
    return (
      <>
        <Head>
          <title>NEAR Explorer | Dashboard</title>
        </Head>
        <Content border={false}>
          <h1>Dashboard</h1>
          <NodeStatsProvider>
            <DashboardHeader />
          </NodeStatsProvider>
          <Row noGutters className="dashboard-section">
            <ListProvider>
              <Col md="8">
                <DashboardTransactions />
              </Col>
              <Col md="4">
                <DashboardBlocks />
              </Col>
            </ListProvider>
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
