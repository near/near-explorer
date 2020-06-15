import Head from "next/head";

import { Container } from "react-bootstrap";

import Contracts from "../../components/contracts/Contracts";
import Content from "../../components/utils/Content";

export default class extends React.Component {
  render() {
    return (
      <>
        <Head>
          <title>Near Explorer | Contracts</title>
        </Head>
        <Container>
          <Content title={<h1>Contracts</h1>} count="">
            <Contracts />
          </Content>
        </Container>
      </>
    );
  }
}
