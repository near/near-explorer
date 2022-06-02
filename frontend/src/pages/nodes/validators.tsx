import Head from "next/head";

import { Container } from "react-bootstrap";

import NodesEpoch from "../../components/nodes/NodesEpoch";
import Validators from "../../components/nodes/Validators";
import Content, { ContentHeader } from "../../components/utils/Content";
import NodesCard from "../../components/nodes/NodesCard";
import NodesContentHeader from "../../components/nodes/NodesContentHeader";

import { NextPage } from "next";
import { useAnalyticsTrackOnMount } from "../../hooks/analytics/use-analytics-track-on-mount";
import { useNetworkStats } from "../../hooks/subscriptions";
import { useEpochStartBlock } from "../../hooks/data";
import { styled } from "../../libraries/styles";
import * as React from "react";

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

  const { data: networkStats } = useNetworkStats();
  const epochStartBlock = useEpochStartBlock();

  return (
    <>
      <Head>
        <title>NEAR Explorer | Nodes</title>
      </Head>

      <Container fluid>
        {!networkStats || !epochStartBlock ? null : (
          <NodesEpoch
            epochLength={networkStats.epochLength}
            epochStartHeight={epochStartBlock.height}
            epochStartTimestamp={epochStartBlock.timestamp}
          />
        )}
      </Container>

      <NodesPage
        border={false}
        fluid
        contentFluid
        header={<NodesContentHeader />}
        overrideHeader={ContentHeaderWrapper}
      >
        <Container>
          <NodesCard
            currentValidatorsCount={networkStats?.currentValidatorsCount}
            totalSupply={epochStartBlock?.totalSupply.toString()}
            totalStake={networkStats ? networkStats.totalStake : undefined}
            seatPrice={networkStats ? networkStats.seatPrice : undefined}
          />
        </Container>
        <ValidatorsWrapper>
          <Validators />
        </ValidatorsWrapper>
      </NodesPage>
    </>
  );
});

export default ValidatorsPage;
