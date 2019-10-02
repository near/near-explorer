import Head from "next/head";

import BlockApi from "../../components/api/Blocks";

import Block from "../../components/Block";

const BlockPage = (props) => (
  <>
    <Head>
      <title>Near Explorer | Block</title>
    </Head>
    <Block block={props} />
  </>
);

BlockPage.getInitialProps = async ({ query: { hash }}) => {
  try {
    return await BlockApi.getBlockInfo(hash);
  } catch (err) {
    return {};
  }
}

export default BlockPage;
