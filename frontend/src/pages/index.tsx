import * as React from "react";

import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { Container, Row, Col } from "react-bootstrap";

import { ExplorerSunsetBanner } from "@/frontend/components/common/ExplorerSunsetBanner";
import { DashboardBlock } from "@/frontend/components/dashboard/DashboardBlock";
import { DashboardNode } from "@/frontend/components/dashboard/DashboardNode";
import { DashboardTransaction } from "@/frontend/components/dashboard/DashboardTransaction";
import { DashboardCardWrapper } from "@/frontend/components/utils/DashboardCard";
import { Search, getRedirectPage } from "@/frontend/components/utils/Search";
import { useAnalyticsTrackOnMount } from "@/frontend/hooks/analytics/use-analytics-track-on-mount";
import { getNearNetworkName } from "@/frontend/libraries/config";
import { styled } from "@/frontend/libraries/styles";
import { getTrpcClient } from "@/frontend/libraries/trpc";

// Import the ExplorerSunsetBanner component

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

const Dashboard: NextPage = React.memo(() => {
  const { t } = useTranslation();
  useAnalyticsTrackOnMount("Explorer View Landing Page");

  return (
    <>
      <Head>
        <title>NEAR Explorer | Dashboard</title>
      </Head>
      <DashboardContainer>
        <ExplorerSunsetBanner /> {/* Add the banner component here */}
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
});

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  const networkName = getNearNetworkName(query, req.headers.host);
  const trpcClient = await getTrpcClient(networkName);
  const searchQuery = query.query;
  if (!searchQuery) {
    return { props: {} };
  }
  const searchQueryValue = Array.isArray(searchQuery)
    ? searchQuery[0]
    : searchQuery;
  const searchResult = await trpcClient.utils.search.mutate({
    value: searchQueryValue.replace(/\s/g, ""),
  });
  const redirectPage = getRedirectPage(searchResult);
  if (redirectPage) {
    return {
      redirect: {
        permanent: true,
        destination: redirectPage,
      },
    };
  }
  return { props: {} };
};

export default Dashboard;
