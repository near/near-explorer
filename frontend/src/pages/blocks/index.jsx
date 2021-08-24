import Head from "next/head";
import { PureComponent } from "react";
import Mixpanel from "../../libraries/mixpanel";

import Blocks from "../../components/blocks/Blocks";
import Content from "../../components/utils/Content";

import { Translate } from "react-localize-redux";

class BlocksPage extends PureComponent {
  componentDidMount() {
    Mixpanel.track("Explorer View Blocks Page");
  }

  render() {
    return (
      <Translate>
        {({ translate }) => (
          <>
            <Head>
              <title>NEAR Explorer | Blocks</title>
            </Head>
            <Content title={<h1>{translate("common.blocks.blocks")}</h1>}>
              <Blocks />
            </Content>
          </>
        )}
      </Translate>
    );
  }
}

export default BlocksPage;
