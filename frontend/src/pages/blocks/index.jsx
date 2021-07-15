import Head from "next/head";

import Mixpanel from "../../libraries/mixpanel";

import Blocks from "../../components/blocks/Blocks";
import Content from "../../components/utils/Content";

import { setI18N } from "../../libraries/language.js";
import { Translate, withLocalize } from "react-localize-redux";

class BlocksPage extends React.PureComponent {
  constructor(props) {
    super(props);
    setI18N(this.props);
  }

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
            <Content
              title={<h1>{translate("common.blocks.title").toString()}</h1>}
            >
              <Blocks />
            </Content>
          </>
        )}
      </Translate>
    );
  }
}

export default withLocalize(BlocksPage);
