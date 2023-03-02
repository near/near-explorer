import * as React from "react";

import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { Container, Row, Col } from "react-bootstrap";

import { TRPCQueryOutput } from "@explorer/common/types/trpc";
import DashboardBlock from "@explorer/frontend/components/dashboard/DashboardBlock";
import DashboardNode from "@explorer/frontend/components/dashboard/DashboardNode";
import DashboardTransaction from "@explorer/frontend/components/dashboard/DashboardTransaction";
import { DashboardCardWrapper } from "@explorer/frontend/components/utils/DashboardCard";
import Search from "@explorer/frontend/components/utils/Search";
import { useAnalyticsTrackOnMount } from "@explorer/frontend/hooks/analytics/use-analytics-track-on-mount";
import { getNearNetworkName } from "@explorer/frontend/libraries/config";
import { styled } from "@explorer/frontend/libraries/styles";
import { getTrpcClient } from "@explorer/frontend/libraries/trpc";

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

const getRedirectPage = (
  result: TRPCQueryOutput<"utils.search">
): string | undefined => {
  if (!result) {
    return undefined;
  }
  if ("blockHash" in result) {
    return `/blocks/${result.blockHash}`;
  }
  if ("receiptId" in result) {
    return `/transactions/${result.transactionHash}#${result.receiptId}`;
  }
  if ("transactionHash" in result) {
    return `/transactions/${result.transactionHash}`;
  }
  if ("accountId" in result) {
    return `/accounts/${result.accountId}`;
  }
  return undefined;
};

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
  const searchResult = await trpcClient.query("utils.search", {
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
