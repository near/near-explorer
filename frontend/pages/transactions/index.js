import Head from "next/head";

import Content from "../../components/Content";
import Transactions from "../../components/transactions/Transactions";

import "bootstrap/dist/css/bootstrap.min.css";

export default () => (
  <>
    <Head>
      <title>Near Explorer | Transactions</title>
    </Head>
    <Content title="Transactions">
      <Transactions />
    </Content>
  </>
);
