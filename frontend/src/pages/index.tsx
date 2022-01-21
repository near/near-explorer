import Head from "next/head";

import { Container, Row, Col } from "react-bootstrap";

import NetworkStatsProvider from "../context/NetworkStatsProvider";

import Search from "../components/utils/Search";
import DashboardNode from "../components/dashboard/DashboardNode";
import DashboardBlock from "../components/dashboard/DashboardBlock";
import DashboardTransaction from "../components/dashboard/DashboardTransaction";
import { useTranslation } from "react-i18next";
import { useAnalyticsTrackOnMount } from "../hooks/analytics/use-analytics-track-on-mount";
import { styled } from "../libraries/stitches.config";

const Header = styled("h1", {
  fontSize: 38,
  lineHeight: "46px",
  whiteSpace: "pre-line",
  marginTop: 72,
  marginLeft: 25,
});

const Dashboard = () => {
  const { t } = useTranslation();
  useAnalyticsTrackOnMount("Explorer View Landing Page");

  return (
    <>
      <Head>
        <title>NEAR Explorer | Dashboard</title>
      </Head>
      <Container>
        <Header>
          <span style={{ color: "#00C1DE" }}>
            {t("page.home.title.explore")}
          </span>
          {t("page.home.title.near_blockchain")}
        </Header>
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
};

export default Dashboard;
