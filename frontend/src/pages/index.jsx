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
          </h1>
          <h1>NEAR Blockchain.</h1>
          <Row className="inner-content">
            <Row noGutters className="search-wrapper">
              <Search dashboard />
            </Row>
            <Row noGutters className="card-area">
              <Col xs="12" md="auto">
                <NodeStatsProvider>
                  <DashboardNode />
                </NodeStatsProvider>
              </Col>
              <Col xs="12" md="auto">
                <DashboardBlock />
              </Col>
            </Row>
            <Row noGutters style={{ marginTop: "20px" }}>
              <DashboardTransaction />
            </Row>
          </Row>
          <style jsx global>{`
            .inner-content {
              margin: 71px 180px;
            }

            .search-wrapper {
              width: 100%;
            }

            h1 {
              font-size: 38px;
              line-height: 46px;
            }

            .card-area {
              width: 740px;
              display: flex;
              justify-content: space-between;
              margin-top: 81px;
            }

            @media (max-width: 1000px) {
              .inner-content {
                margin: 32px auto;
              }
              .container {
                margin: auto auto;
                padding: 0;
              }
            }
          `}</style>
        </Container>
      </>
    );
  }
}
