import Head from "next/head";

import NodesMap from "../../components/nodes/NodesMap";

export default class extends React.Component {
  render() {
    return (
      <>
        <Head>
          <title>Near Explorer | Nodes Map</title>
        </Head>
        <NodesMap />
      </>
    );
  }
}
