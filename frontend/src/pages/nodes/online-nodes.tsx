import Head from "next/head";

import { Container } from "react-bootstrap";

import NodesEpoch from "../../components/nodes/NodesEpoch";
import Nodes from "../../components/nodes/Nodes";
import Content, { ContentHeader } from "../../components/utils/Content";

import NodesContentHeader from "../../components/nodes/NodesContentHeader";
import { NextPage } from "next";
import { useAnalyticsTrackOnMount } from "../../hooks/analytics/use-analytics-track-on-mount";
import { useNetworkStats, useFinalityStatus } from "../../hooks/subscriptions";
import {
  useEpochStartBlock,
  useFinalBlockTimestampNanosecond,
} from "../../hooks/data";
import { styled } from "../../libraries/styles";

const OnlineNodesWrapper = styled(Content, {
  backgroundColor: "#ffffff",

  "@media (max-width: 576px)": {
    "& > .container, & > .container > .container": {
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

const OnlineNodes: NextPage = () => {
  useAnalyticsTrackOnMount("Explorer View Online Node page");

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

      <OnlineNodesWrapper
        border={false}
        fluid
        contentFluid
        header={<NodesContentHeader navRole="online-nodes" />}
        overrideHeader={ContentHeaderWrapper}
      >
        <Container>
          <Nodes />
        </Container>
      </OnlineNodesWrapper>
    </>
  );
};

export default OnlineNodes;
