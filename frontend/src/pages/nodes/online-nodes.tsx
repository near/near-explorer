import Head from "next/head";

import { Container } from "react-bootstrap";

import NodesEpoch from "../../components/nodes/NodesEpoch";
import Nodes from "../../components/nodes/Nodes";
import Content from "../../components/utils/Content";

import NodesContentHeader from "../../components/nodes/NodesContentHeader";
import { NextPage } from "next";
import { useAnalyticsTrackOnMount } from "../../hooks/analytics/use-analytics-track-on-mount";
import { useNetworkStats, useFinalityStatus } from "../../hooks/subscriptions";
import {
  useEpochStartBlock,
  useFinalBlockTimestampNanosecond,
} from "../../hooks/data";

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

      <Content
        border={false}
        fluid
        contentFluid
        className="online-nodes-page"
        header={<NodesContentHeader navRole="online-nodes" />}
      >
        <Container>
          <Nodes />
        </Container>
      </Content>
      <style global jsx>{`
        .online-nodes-page {
          background-color: #ffffff;
        }

        @media (max-width: 576px) {
          .online-nodes-page > .container-fluid,
          .online-nodes-page > .container-fluid > .container {
            padding-left: 0;
            padding-right: 0;
          }
        }
        @media (min-width: 576px) {
          .content-header {
            padding-left: 32px;
            padding-right: 32px;
          }
        }

        .content-header {
          background: #fafafa;
          margin-left: -15px;
          margin-right: -15px;
          padding-bottom: 0;
        }
      `}</style>
    </>
  );
};

export default OnlineNodes;
