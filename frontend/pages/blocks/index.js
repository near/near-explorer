import Head from "next/head";

import { useContext, useEffect } from "react";

import BlocksApi from "../../libraries/explorer-wamp/Blocks";

import Blocks from "../../components/blocks/Blocks";
import { DataContext } from "../../components/utils/DataProvider";

const Index = ({ blocks, total, start, stop }) => {
  const ctx = useContext(DataContext);

  useEffect(() => {
    ctx.setBlocks(blocks);
    ctx.setPagination(pagination => {
      return {
        ...pagination,
        search: "",
        total,
        start,
        stop
      };
    });
  }, []);

  return (
    <>
      <Head>
        <title>Near Explorer | Blocks</title>
      </Head>
      <Blocks />
    </>
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
