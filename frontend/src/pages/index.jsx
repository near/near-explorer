import Head from "next/head";

import { Container, Row, Col } from "react-bootstrap";

import Mixpanel from "../libraries/mixpanel";
import NetworkStatsProvider from "../context/NetworkStatsProvider";

import Search from "../components/utils/Search";
import DashboardNode from "../components/dashboard/DashboardNode";
import DashboardBlock from "../components/dashboard/DashboardBlock";
import DashboardTransaction from "../components/dashboard/DashboardTransaction";
class Dashboard extends React.Component {
  componentDidMount() {
    Mixpanel.track("Explorer View Landing Page");
  }

  render() {
    return (
      <>
        <Head>
          <title>NEAR Explorer | Dashboard</title>
        </Head>
        <Container>
          <h1 style={{ marginTop: "72px", marginLeft: "25px" }}>
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
              <Row className="card-area" noGutters>
                <Col xs="12" md="6" className="mt-4">
                  <NetworkStatsProvider>
                    <DashboardNode />
                  </NetworkStatsProvider>
                </Col>
                <Col xs="12" md="6" className="mt-4">
                  <DashboardBlock className="ml-md-4" />
                </Col>
              </Row>
            </Col>
            <Col xs="12" className="mt-4">
              <DashboardTransaction />
            </Col>
          </Row>
          <style jsx global>{`
            .inner-content {
              margin: 71px 185px;
            }

            .search-wrapper {
              margin-bottom: 50px;
            }

            h1 {
              font-size: 38px;
              line-height: 46px;
            }

            @media (max-width: 1200px) {
              .inner-content {
                margin: 32px 100px;
              }
            }

            @media (max-width: 990px) {
              .inner-content {
                margin: 32px auto;
              }
            }

            @media (max-width: 415px) {
              .container {
                padding: 0 1px 0 0;
              }

              .transaction-card {
                box-shadow: none;
              }
            }
          `}</style>
        </Container>
      </>
    );
  }
}

export default Dashboard;
