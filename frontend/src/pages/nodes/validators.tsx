import * as React from "react";

import { NextPage } from "next";
import Head from "next/head";
import { Container } from "react-bootstrap";

import { ExplorerSunsetBanner } from "@/frontend/components/common/ExplorerSunsetBanner";
import { NodesCard } from "@/frontend/components/nodes/NodesCard";
import { NodesContentHeader } from "@/frontend/components/nodes/NodesContentHeader";
import { NodesEpoch } from "@/frontend/components/nodes/NodesEpoch";
import { Validators } from "@/frontend/components/nodes/Validators";
import { Content, ContentHeader } from "@/frontend/components/utils/Content";
import { useAnalyticsTrackOnMount } from "@/frontend/hooks/analytics/use-analytics-track-on-mount";
import { styled } from "@/frontend/libraries/styles";

const NodesPage = styled(Content, {
  backgroundColor: "#ffffff",

  "@media (max-width: 576px)": {
    "& > .container-fluid, & > .container-fluid > .container": {
      paddingHorizontal: 0,
    },
  },
});

const ContentHeaderWrapper = styled(ContentHeader, {
  background: "#fafafa",
  marginHorizontal: -15,
  paddingBottom: 0,

  "@media (min-width: 576px)": {
    paddingHorizontal: 32,
  },
});

const ValidatorsWrapper = styled(Container, {
  paddingTop: 24,
  paddingBottom: 50,
});

const ValidatorsPage: NextPage = React.memo(() => {
  useAnalyticsTrackOnMount("Explorer View Validator Node page");

  return (
    <>
      <Head>
        <title>NEAR Explorer | Nodes</title>
      </Head>
      <div style={{ maxWidth: "1110px", margin: "0 auto" }}>
        <ExplorerSunsetBanner /> {/* Add the banner component here */}
      </div>

      <Container fluid>
        <NodesEpoch />
      </Container>

      <NodesPage
        border={false}
        fluid
        contentFluid
        header={<NodesContentHeader />}
        overrideHeader={ContentHeaderWrapper}
      >
        <Container>
          <NodesCard />
        </Container>
        <ValidatorsWrapper>
          <Validators />
        </ValidatorsWrapper>
      </NodesPage>
    </>
  );
});

export default ValidatorsPage;
