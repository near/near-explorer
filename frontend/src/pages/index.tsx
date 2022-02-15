import Head from "next/head";

import { Container, Row, Col } from "react-bootstrap";

import Search from "../components/utils/Search";
import DashboardNode from "../components/dashboard/DashboardNode";
import DashboardBlock from "../components/dashboard/DashboardBlock";
import DashboardTransaction from "../components/dashboard/DashboardTransaction";
import { useTranslation } from "react-i18next";
import { useAnalyticsTrackOnMount } from "../hooks/analytics/use-analytics-track-on-mount";
import { styled } from "../libraries/styles";
import { DashboardCardWrapper } from "../components/utils/DashboardCard";

const InnerContent = styled(Row, {
  margin: "71px 185px",
  "@media (max-width: 1200px)": {
    margin: "32px 100px",
  },

  "@media (max-width: 990px)": {
    margin: "32px auto",
  },
});

const SearchRowWrapper = styled(Row, {
  marginBottom: 50,
});

const Header = styled("h1", {
  fontSize: 38,
  lineHeight: "46px",
  whiteSpace: "pre-line",
  marginTop: 72,
  marginLeft: 25,
});

const ExplorerTitle = styled("span", {
  color: "#00C1DE",
});

const DashboardContainer = styled(Container, {
  "@media (max-width: 415px)": {
    padding: "0 1px 0 0",
    [`& ${DashboardCardWrapper}`]: {
      boxShadow: "none",
    },
  },
});

const Dashboard = () => {
  const { t } = useTranslation();
  useAnalyticsTrackOnMount("Explorer View Landing Page");

  return (
    <>
      <Head>
        <title>NEAR Explorer | Dashboard</title>
      </Head>
      <DashboardContainer>
        <Header>
          <ExplorerTitle>{t("page.home.title.explore")}</ExplorerTitle>
          {t("page.home.title.near_blockchain")}
        </Header>
        <InnerContent noGutters>
          <Col xs="12" className="d-none d-md-block d-lg-block">
            <SearchRowWrapper noGutters>
              <Search dashboard />
            </SearchRowWrapper>
          </Col>
          <Col xs="12">
            <Row noGutters>
              <Col xs="12" md="6" className="mt-4">
                <DashboardNode />
              </Col>
              <Col xs="12" md="6" className="mt-4">
                <DashboardBlock />
              </Col>
            </Row>
          </Col>
          <Col xs="12" className="mt-4">
            <DashboardTransaction />
          </Col>
        </InnerContent>
      </DashboardContainer>
    </>
  );
};

export default Dashboard;
