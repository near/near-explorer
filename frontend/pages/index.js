import Head from "next/head";

import { useEffect, useContext } from "react";

import Header from "../components/Header";
import Dashboard from "../components/Dashboard";
import Footer from "../components/Footer";

import { DataContext } from "../components/utils/DataProvider";

import BlocksApi from "../components/api/Blocks";
import DetailsApi from "../components/api/Details";
import TransactionsApi from "../components/api/Transactions";

import "bootstrap/dist/css/bootstrap.min.css";

const Index = ({ blocks, details, transactions }) => {
  const ctx = useContext(DataContext);

  useEffect(() => {
    ctx.setBlocks(blocks);
    ctx.setDetails(details);
    ctx.setTransactions(transactions);
  }, []);

  return (
    <div>
      <Head>
        <link rel="shortcut icon" type="image/png" href="/static/favicon.ico" />
        <title>Near Explorer | Dashboard</title>
      </Head>
      <Header />
      <Dashboard />
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
