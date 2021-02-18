import Head from "next/head";

import { Mixpanel } from "../../../mixpanel/index";

import NodesMap from "../../components/nodes/NodesMap";
import NodeProvider from "../../context/NodeProvider";
export default class extends React.Component {
  render() {
    Mixpanel.track("View Node Map Page");
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
