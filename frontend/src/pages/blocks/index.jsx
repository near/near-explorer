import Head from "next/head";

import Blocks from "../../components/blocks/Blocks";
import Content from "../../components/utils/Content";

export default class extends React.Component {
  render() {
    return (
      <>
        <Head>
          <title>Near Explorer | Blocks</title>
        </Head>
        <Content title={<h1>Blocks</h1>}>
          <Blocks />
        </Content>
      </>
    );
  }
}
