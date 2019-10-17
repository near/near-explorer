import Head from "next/head";

import Nodes from "../../components/nodes/Nodes";
import Content from "../../components/utils/Content";

export default class extends React.Component {
  render() {
    return (
      <>
        <Head>
          <title>Near Explorer | Nodes</title>
        </Head>
        <Content title={<h1>Nodes</h1>}>
          <Nodes />
        </Content>
      </>
    );
  }
}
