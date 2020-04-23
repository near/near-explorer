import Head from "next/head";

import React from "react";

import NodeNav from "../../components/nodes/NodeNav";

import Nodes from "../../components/nodes/Nodes";
import Content from "../../components/utils/Content";

export default class extends React.Component {
  static async getInitialProps({ query: { role } }) {
    try {
      return { role };
    } catch (err) {
      return { role, err };
    }
  }
  render() {
    return (
      <>
        <Head>
          <title>Near Explorer | Nodes</title>
        </Head>
        <Content title={<h1>Nodes</h1>}>
          <NodeNav />
          <Nodes role={this.props.role} />
        </Content>
      </>
    );
  }
}
