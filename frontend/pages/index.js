import Head from "next/head";

import { useEffect, useContext } from "react";

import Dashboard from "../components/Dashboard";

import { DataContext } from "../components/utils/DataProvider";

import BlocksApi from "../components/api/Blocks";
import DetailsApi from "../components/api/Details";
import TransactionsApi from "../components/api/Transactions";

const Index = ({ blocks, details, transactions }) => {
  const ctx = useContext(DataContext);

  useEffect(() => {
    ctx.setBlocks(blocks);
    ctx.setDetails(details);
    ctx.setTransactions(transactions);
  }, []);

  return (
    <>
      <Head>
        <title>Near Explorer | Dashboard</title>
      </Head>
      <Dashboard />
    </>
  );
};

Index.getInitialProps = async () => {
  const details = DetailsApi.getDetails().catch(() => null);
  const blocks = BlocksApi.getLatestBlocksInfo().catch(() => null);
  const transactions = TransactionsApi.getLatestTransactionsInfo().catch(
    () => null
  );
  return {
    details: await details,
    blocks: await blocks,
    transactions: await transactions
  };
};

export default Index;
