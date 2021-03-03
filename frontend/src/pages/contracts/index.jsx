import Head from "next/head";

import Contracts from "../../components/contracts/Contracts";
import Content from "../../components/utils/Content";

class Contracts extends React.Component {
  render() {
    return (
      <>
        <Head>
          <title>NEAR Explorer | Contracts</title>
        </Head>
        <Content title={<h1>Contracts</h1>} count="">
          <Contracts />
        </Content>
      </>
    );
  }
}

export default Contracts;
