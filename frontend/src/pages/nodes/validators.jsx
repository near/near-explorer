import Head from "next/head";

import React from "react";

import Mixpanel from "../../libraries/mixpanel";

import NodeNav from "../../components/nodes/NodeNav";
import Validators from "../../components/nodes/Validators";
import Content from "../../components/utils/Content";

import NodeProvider from "../../context/NodeProvider";
import NodeStatsProvider from "../../context/NodeStatsProvider";

class ValidatorsPage extends React.Component {
  render() {
    Mixpanel.track("Explorer View Validator Node page");
    return (
      <>
        <Head>
          <title>NEAR Explorer | Nodes</title>
        </Head>
        <Content title={<h1>Validating Nodes</h1>}>
          <NodeStatsProvider>
            <NodeNav role={"validators"} />
          </NodeStatsProvider>
          <NodeProvider>
            <Validators />
          </NodeProvider>
        </Content>
      </>
    );
  }
}

export default ValidatorsPage;
