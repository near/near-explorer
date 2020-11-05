import Head from "next/head";

import { Container, Row, Col } from "react-bootstrap";

import NodeStatsProvider from "../context/NodeStatsProvider";

import Search from "../components/utils/Search";
import DashboardNode from "../components/dashboard/DashboardNode";
import DashboradBlock from "../components/dashboard/DashboradBlock";
import DashboardTransaction from "../components/dashboard/DashboardTransaction";
export default class extends React.Component {
  render() {
    return (
      <>
        <Head>
          <title>Near Explorer | Dashboard</title>
        </Head>
        <Container>
          <h1 style={{ marginTop: "72px" }}>
            <span style={{ color: "#00C1DE" }}>Explore</span> the
          </h1>
          <h1>NEAR Blockchain.</h1>
          <Row className="inner-content" noGutters>
            <Row noGutters>
              <Search dashboard />
            </Row>
            <Row noGutters className="card-area">
              <Col xs="12" md="auto">
                <NodeStatsProvider>
                  <DashboardNode />
                </NodeStatsProvider>
              </Col>
              <Col xs="12" md="auto">
                <DashboradBlock />
              </Col>
            </Row>
            <Row noGutters style={{ marginTop: "20px" }}>
              <DashboardTransaction />
            </Row>
          </Row>
          <style jsx global>{`
            .inner-content {
              margin: 32px 100px;
            }
            h1 {
              font-size: 38px;
              line-height: 46px;
            }
            .card-area {
              width: 100%;
              display: flex;
              justify-content: space-between;
              margin-top: 81px;
            }
          `}</style>
        </Container>
      </>
    );
  }
}
