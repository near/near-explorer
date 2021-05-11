import Head from "next/head";

import React from "react";

import Mixpanel from "../../libraries/mixpanel";

import NodeNav from "../../components/nodes/NodeNav";
import Proposals from "../../components/nodes/Proposals";
import Content from "../../components/utils/Content";

import NodeProvider from "../../context/NodeProvider";
import NodeStatsProvider from "../../context/NodeStatsProvider";

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
        <Content title={<h1>Proposal Nodes</h1>}>
          <NodeStatsProvider>
            <NodeNav role={"proposals"} />
          </NodeStatsProvider>
          <NodeProvider>
            <Proposals />
          </NodeProvider>
        </Content>
      </>
    );
  }
}

export default ProposalsPage;
