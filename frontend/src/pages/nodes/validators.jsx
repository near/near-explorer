import Head from "next/head";

import React from "react";

import NodeNav from "../../components/nodes/NodeNav";
import Validators from "../../components/nodes/Validators";
import Content from "../../components/utils/Content";

export default class extends React.Component {
  render() {
    return (
      <>
        <Head>
          <title>Near Explorer | Nodes</title>
        </Head>
        <Content title={<h1>Validating Nodes</h1>}>
          <NodeNav role={"validators"} />
          <Validators />
        </Content>
      </>
    );
  }
}
