import Head from "next/head";

import Header from "../../components/Header";
import Transactions from "../../components/Transactions";
import Footer from "../../components/Footer";

import "bootstrap/dist/css/bootstrap.min.css";

export default () => (
  <div>
    <Head>
      <link rel="shortcut icon" type="image/png" href="/static/favicon.ico" />
      <title>Near Explorer | Transactions</title>
    </Head>
    <Header />
    <Transactions />
    <Footer />
    <style jsx global>{`
      body {
        background-color: #f8f8f8;
      }
    `}</style>
  </div>
);
