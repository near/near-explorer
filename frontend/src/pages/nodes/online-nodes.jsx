import Head from "next/head";

import React from "react";

import NodeNav from "../../components/nodes/NodeNav";
import Nodes from "../../components/nodes/Nodes";
import Content from "../../components/utils/Content";

export default class extends React.Component {
  render() {
    return (
      <>
        <Head>
          <title>Near Explorer | Nodes</title>
        </Head>
        <Content title={<h1>Online Nodes</h1>}>
          <NodeNav role={"online-nodes"} />
          <Nodes />
        </Content>
      </>
    );
  }
}
