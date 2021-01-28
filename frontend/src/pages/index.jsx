import Head from "next/head";

import { Container, Row, Col } from "react-bootstrap";

import NodeStatsProvider from "../context/NodeStatsProvider";

import Search from "../components/utils/Search";
import DashboardNode from "../components/dashboard/DashboardNode";
import DashboardBlock from "../components/dashboard/DashboardBlock";
import DashboardTransaction from "../components/dashboard/DashboardTransaction";
export default class extends React.Component {
  render() {
    return (
      <>
        <Head>
          <title>NEAR Explorer | Dashboard</title>
        </Head>
        <Container>
          <h1 style={{ marginTop: "72px" }}>
            <span style={{ color: "#00C1DE" }}>Explore</span> the
            <br />
            NEAR Blockchain.
          </h1>
          <Row className="inner-content" noGutters>
            <Col xs="12" className="d-none d-md-block d-lg-block">
              <Row noGutters className="search-wrapper">
                <Search dashboard />
              </Row>
            </Col>
            <Col xs="12">
              <Row className="card-area">
                <Col xs="12" md="6">
                  <NodeStatsProvider>
                    <DashboardNode />
                  </NodeStatsProvider>
                </Col>
                <Col xs="12" md="6" noGutters>
                  <DashboardBlock />
                </Col>
              </Row>
            </Col>
            <Col xs="12" noGutters>
              <DashboardTransaction />
            </Col>
          </Row>
          <style jsx global>{`
            .inner-content {
              margin: 71px 180px;
            }

            .search-wrapper {
              margin-bottom: 50px;
            }

            h1 {
              font-size: 38px;
              line-height: 46px;
            }

            @media (max-width: 1000px) {
              .inner-content {
                margin: 32px auto;
              }
            }
          `}</style>
        </Container>
      </>
    );
  }
}
