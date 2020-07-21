import Head from "next/head";

import React from "react";

import NodeNav from "../../components/nodes/NodeNav";
import Proposals from "../../components/nodes/Proposals";
import Content from "../../components/utils/Content";

export default class extends React.Component {
  render() {
    return (
      <>
        <Head>
          <title>Near Explorer | Nodes</title>
        </Head>
        <Content title={<h1>Proposal Nodes</h1>}>
          <NodeNav role={"proposals"} />
          <Proposals />
        </Content>
      </>
    );
  }
}
