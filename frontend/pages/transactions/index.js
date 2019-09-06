import Head from "next/head";

import Transactions from "../../components/Transactions";

import "bootstrap/dist/css/bootstrap.min.css";

export default () => (
  <>
    <Head>
      <title>Near Explorer | Transactions</title>
    </Head>
    <Transactions />
  </>
);
