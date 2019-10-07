import Head from "next/head";

import BlockApi from "../../libraries/explorer-wamp/Blocks";

import Block from "../../components/blocks/Block";

const BlockPage = props => (
  <>
    <Head>
      <title>Near Explorer | Block</title>
    </Head>
    <Block block={props} />
  </>
);

BlockPage.getInitialProps = async ({ query: { hash } }) => {
  try {
    return await BlockApi.getBlockInfo(hash);
  } catch (err) {
    return {};
  }
};

export default BlockPage;
