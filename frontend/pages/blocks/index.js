import Head from "next/head";

import { useContext, useEffect } from "react";

import BlocksApi from "../../components/api/Blocks";
import { DataContext } from "../../components/utils/DataProvider";

import Header from "../../components/Header";
import Blocks from "../../components/Blocks";
import Footer from "../../components/Footer";

import "bootstrap/dist/css/bootstrap.min.css";

const Index = ({ blocks, total }) => {
  const ctx = useContext(DataContext);

  useEffect(() => {
    if (blocks.length > 0) {
      ctx.setPagination(pagination => {
        return {
          ...pagination,
          total: total,
          start: blocks[0].height,
          stop: blocks[blocks.length - 1].height
        };
      });
      ctx.setBlocks(blocks);
    }
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
  let total = 0;
  let blocks = [];

  try {
    blocks = await BlocksApi.getLatestBlocksInfo();
    total = await BlocksApi.getTotal();
  } catch (err) {
    console.log(err);
  }

  return { blocks, total };
};

export default Index;
