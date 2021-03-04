import Head from "next/head";

import Blocks from "../../components/blocks/Blocks";
import Content from "../../components/utils/Content";

class BlocksPage extends React.PureComponent {
  render() {
    return (
      <>
        <Head>
          <title>NEAR Explorer | Blocks</title>
        </Head>
        <Content title={<h1>Blocks</h1>}>
          <Blocks />
        </Content>
      </>
    );
  }
}

export default BlocksPage;
