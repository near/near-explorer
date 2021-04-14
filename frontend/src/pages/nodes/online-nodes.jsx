import Head from "next/head";

import React from "react";

import Mixpanel from "../../libraries/mixpanel";

import { Container } from "react-bootstrap";

import NodesEpoch from "../../components/nodes/NodesEpoch";
import Nodes from "../../components/nodes/Nodes";
import Content from "../../components/utils/Content";

import NodeProvider from "../../context/NodeProvider";
import NodesContentHeader from "../../components/nodes/NodesContentHeader";

class OnlineNodes extends React.Component {
  componentDidMount() {
    Mixpanel.track("Explorer View Online Node page");
  }

  render() {
    return (
      <>
        <Head>
          <title>NEAR Explorer | Nodes</title>
        </Head>

        <Container fluid>
          <NodesEpoch />
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
        <style global jsx>{`
          .online-nodes-page {
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

export default OnlineNodes;
