import Head from "next/head";

import { useContext, useEffect } from "react";

import BlocksApi from "../../components/api/Blocks";
import { DataContext } from "../../components/utils/DataProvider";

import Header from "../../components/Header";
import Blocks from "../../components/Blocks";
import Footer from "../../components/Footer";

import "bootstrap/dist/css/bootstrap.min.css";

const Index = ({ blocks, total, start, stop }) => {
  const ctx = useContext(DataContext);

  useEffect(() => {
    ctx.setBlocks(blocks);
    ctx.setPagination(pagination => {
      return {
        ...pagination,
        total,
        start,
        stop
      };
    });
  }, []);

  return (
    <div>
      <Head>
        <link rel="shortcut icon" type="image/png" href="/static/favicon.ico" />
        <title>Near Explorer | Blocks</title>
      </Head>
      <Header />
      <Blocks />
      <Footer />
      <style jsx global>{`
        body {
          background-color: #f8f8f8;
        }
      `}</style>
    </div>
  );
};

Index.getInitialProps = async () => {
  let start = 0;
  let stop = 0;
  let total = 0;
  let blocks = [];

  try {
    blocks = await BlocksApi.getLatestBlocksInfo();
    total = await BlocksApi.getTotal();

    if (blocks.length > 0) {
      start = blocks[0].height;
      stop = blocks[blocks.length - 1].height;
    }
  } catch (err) {
    console.error("Blocks.getInitialProps failed to fetch data due to:");
    console.error(err);
    throw error;
  }

  return { blocks, total, start, stop };
};

export default Index;
