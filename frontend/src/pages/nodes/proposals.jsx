import Head from "next/head";

import React from "react";

import Mixpanel from "../../libraries/mixpanel";

import { Container } from "react-bootstrap";

import NodesEpoch from "../../components/nodes/NodesEpoch";
import Validators from "../../components/nodes/Validators";

import Content from "../../components/utils/Content";
import NodesContentHeader from "../../components/nodes/NodesContentHeader";

import NodeProvider from "../../context/NodeProvider";
import NodeStatsProvider, {
  NodeStatsConsumer,
} from "../../context/NodeStatsProvider";

class ProposalsPage extends React.Component {
  componentDidMount() {
    Mixpanel.track("Explorer View Proposal Node page");
  }

  render() {
    return (
      <>
        <Head>
          <title>NEAR Explorer | Nodes</title>
        </Head>

        <Container fluid>
          <NodeStatsProvider>
            <NodeStatsConsumer>
              {(context) => <NodesEpoch {...context} />}
            </NodeStatsConsumer>
          </NodeStatsProvider>
        </Container>

        <Content
          border={false}
          fluid
          contentFluid
          className="proposals-page"
          header={<NodesContentHeader navRole="proposals" />}
        >
          <NodeProvider>
            <Container style={{ paddingTop: "50px", paddingBottom: "50px" }}>
              <Validators type="proposals" />
            </Container>
          </NodeProvider>
        </Content>
        <style global jsx>{`
          .proposals-page {
            background-color: #ffffff;
          }

          .content-header {
            background: #fafafa;
            margin-left: -15px;
            margin-right: -15px;
          }
        `}</style>
      </>
    );
  }
}

export default ProposalsPage;
