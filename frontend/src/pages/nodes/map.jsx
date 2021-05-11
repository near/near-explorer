import Head from "next/head";

import Mixpanel from "../../libraries/mixpanel";

import NodesMap from "../../components/nodes/NodesMap";
import NodeProvider from "../../context/NodeProvider";
class Map extends React.Component {
  componentDidMount() {
    Mixpanel.track("Explorer View Node Map Page");
  }

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

export default Map;
