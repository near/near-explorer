import Head from "next/head";

import NodesMap from "../../components/nodes/NodesMap";
import NodeProvider from "../../context/NodeProvider";
export default class extends React.Component {
  render() {
    return (
      <>
        <Head>
          <title>NEAR Explorer | Nodes Map</title>
        </Head>
        <NodeProvider>
          <NodesMap />
        </NodeProvider>
      </>
    );
  }
}
