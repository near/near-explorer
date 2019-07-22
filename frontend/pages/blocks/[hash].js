import Head from "next/head";

import BlockApi from "../../components/api/Blocks";

import Header from "../../components/Header";
import Block from "../../components/Block";
import Footer from "../../components/Footer";

import "bootstrap/dist/css/bootstrap.min.css";

const BlockPage = (props) => (
  <div>
    <Head>
      <link rel="shortcut icon" type="image/png" href="/static/favicon.ico" />
      <title>Near Explorer | Block</title>
    </Head>
    <Header />
    <Block block={props}/>
    <Footer />
    <style jsx global>{`
      body {
        background-color: #f8f8f8;
      }
    `}</style>
  </div>
);

BlockPage.getInitialProps = async ({ query: { hash }}) => {
  try {
    return await BlockApi.getBlockInfo(hash);
  } catch (err) {
    return {};
  }
}

export default BlockPage;
