import Head from "next/head";

import { Row, Col } from "react-bootstrap";

import Content from "../../components/utils/Content";
import NodesMap from "../../components/nodes/NodesMap";


export default class extends React.Component {
  render() {
    return (
      <>
        <Head>
          <title>Near Explorer | Nodes Map</title>
        </Head>
        <Content title={<h1>Nodes Map</h1>} border={false}>
          <NodesMap/>
        </Content>
      </>
    );
  }
}
