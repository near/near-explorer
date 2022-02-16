import Head from "next/head";
import BN from "bn.js";

import { Container } from "react-bootstrap";

import NodesEpoch from "../../components/nodes/NodesEpoch";
import Validators from "../../components/nodes/Validators";
import Content, { ContentHeader } from "../../components/utils/Content";
import NodesCard from "../../components/nodes/NodesCard";
import NodesContentHeader from "../../components/nodes/NodesContentHeader";

import { NextPage } from "next";
import { useAnalyticsTrackOnMount } from "../../hooks/analytics/use-analytics-track-on-mount";
import { useNetworkStats, useFinalityStatus } from "../../hooks/subscriptions";
import {
  useEpochStartBlock,
  useFinalBlockTimestampNanosecond,
} from "../../hooks/data";
import { styled } from "../../libraries/styles";

const NodesPage = styled(Content, {
  backgroundColor: "#ffffff",

  "@media (max-width: 576px)": {
    "& > .container-fluid, & > .container-fluid > .container": {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
});

const ContentHeaderWrapper = styled(ContentHeader, {
  background: "#fafafa",
  marginLeft: -15,
  marginRight: -15,
  paddingBottom: 0,

  "@media (min-width: 576px)": {
    paddingLeft: 32,
    paddingRight: 32,
  },
});

const ValidatorsWrapper = styled(Container, {
  paddingTop: 24,
  paddingBottom: 50,
});

const ValidatorsPage: NextPage = () => {
  useAnalyticsTrackOnMount("Explorer View Validator Node page");

  const networkStats = useNetworkStats();
  const epochStartBlock = useEpochStartBlock();
  const finalBlockHeight = useFinalityStatus()?.finalBlockHeight;
  const finalBlockTimestampNanosecond = useFinalBlockTimestampNanosecond();

  return (
    <>
      <Head>
        <title>NEAR Explorer | Nodes</title>
      </Head>

      <Container fluid>
        {!networkStats ||
        !epochStartBlock ||
        typeof finalBlockHeight !== "number" ||
        !finalBlockTimestampNanosecond ? null : (
          <NodesEpoch
            epochLength={networkStats.epochLength}
            epochStartHeight={epochStartBlock.height}
            epochStartTimestamp={epochStartBlock.timestamp}
            latestBlockHeight={finalBlockHeight}
            latestBlockTimestamp={finalBlockTimestampNanosecond
              .divn(10 ** 6)
              .toNumber()}
          />
        )}
      </Container>

      <NodesPage
        border={false}
        fluid
        contentFluid
        header={<NodesContentHeader navRole="validators" />}
        overrideHeader={ContentHeaderWrapper}
      >
        <Container>
          <NodesCard
            currentValidatorsCount={networkStats?.currentValidatorsCount}
            totalSupply={epochStartBlock?.totalSupply.toString()}
            totalStake={
              networkStats
                ? new BN(networkStats.totalStake).toString()
                : undefined
            }
            seatPrice={
              networkStats
                ? new BN(networkStats.seatPrice).toString()
                : undefined
            }
          />
        </Container>
        <ValidatorsWrapper>
          <Validators />
        </ValidatorsWrapper>
      </NodesPage>
    </>
  );
};

export default ValidatorsPage;
