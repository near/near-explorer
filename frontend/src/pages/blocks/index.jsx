import Head from "next/head";

import Mixpanel from "../../libraries/mixpanel";

import Blocks from "../../components/blocks/Blocks";
import Content from "../../components/utils/Content";

export default class extends React.Component {
  render() {
    Mixpanel.track("View Blocks Page");
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
