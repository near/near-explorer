import Head from "next/head";

import React from "react";

import Mixpanel from "../../libraries/mixpanel";

import NodeNav from "../../components/nodes/NodeNav";
import Nodes from "../../components/nodes/Nodes";
import Content from "../../components/utils/Content";

import NodeProvider from "../../context/NodeProvider";
import NodeStatsProvider from "../../context/NodeStatsProvider";

class OnlineNodes extends React.Component {
  render() {
    Mixpanel.track("Explorer View Online Node page");
    return (
      <>
        <Head>
          <title>NEAR Explorer | Nodes</title>
        </Head>
        <Content title={<h1>Online Nodes</h1>}>
          <NodeStatsProvider>
            <NodeNav role={"online-nodes"} />
          </NodeStatsProvider>
          <NodeProvider>
            <Nodes />
          </NodeProvider>
        </Content>
      </>
    );
  }
}

export default OnlineNodes;
