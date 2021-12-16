import Head from "next/head";

import { Component } from "react";

import Mixpanel from "../../libraries/mixpanel";

import { Container } from "react-bootstrap";

import NodesEpoch from "../../components/nodes/NodesEpoch";
import Nodes from "../../components/nodes/Nodes";
import Content from "../../components/utils/Content";

import NodeProvider from "../../context/NodeProvider";
import NodesContentHeader from "../../components/nodes/NodesContentHeader";
import NetworkStatsProvider, {
  NetworkStatsConsumer,
} from "../../context/NetworkStatsProvider";

class OnlineNodes extends Component {
  componentDidMount() {
    Mixpanel.track("Explorer View Online Node page");
  }

  render() {
    return (
      <>
        <Head>
          <title>NEAR Explorer | Nodes</title>
        </Head>

        <NetworkStatsProvider>
          <Container fluid>
            <NetworkStatsConsumer>
              {({ networkStats, epochStartBlock, finalityStatus }) => {
                if (!networkStats || !epochStartBlock || !finalityStatus) {
                  return null;
                }
                return (
                  <NodesEpoch
                    epochLength={networkStats.epochLength}
                    epochStartHeight={epochStartBlock.height}
                    epochStartTimestamp={epochStartBlock.timestamp}
                    latestBlockHeight={finalityStatus.finalBlockHeight}
                    latestBlockTimestamp={finalityStatus.finalBlockTimestampNanosecond
                      .divn(10 ** 6)
                      .toNumber()}
                  />
                );
              }}
            </NetworkStatsConsumer>
          </Container>

          <Content
            border={false}
            fluid
            contentFluid
            className="online-nodes-page"
            header={<NodesContentHeader navRole="online-nodes" />}
          >
            <NodeProvider>
              <Container>
                <Nodes />
              </Container>
            </NodeProvider>
          </Content>
        </NetworkStatsProvider>
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
  }
}

export default OnlineNodes;
