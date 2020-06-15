import Head from "next/head";

import { Row, Col, Container } from "react-bootstrap";

import Content from "../components/utils/Content";
import DashboardBlocks from "../components/dashboard/DashboardBlocks";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardTransactions from "../components/dashboard/DashboardTransactions";

export default class extends React.Component {
  render() {
    return (
      <>
        <Head>
          <title>Near Explorer | Dashboard</title>
        </Head>
        <Container>
          <Content title={<h1>Dashboard</h1>} border={false}>
            <DashboardHeader />
            <Row noGutters className="dashboard-section">
              <Col md="8">
                <DashboardTransactions />
              </Col>
              <Col md="4">
                <DashboardBlocks />
              </Col>
            </Row>
            <style jsx global>{`
              .dashboard-section {
                margin-top: 1.5em;
              }
            `}</style>
          </Content>
        </Container>
      </>
    );
  }
}
