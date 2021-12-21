import { NextPage } from "next";
import Head from "next/head";
import Content from "../../components/utils/Content";

const Contracts: NextPage = () => (
  <>
    <Head>
      <title>NEAR Explorer | Contracts</title>
    </Head>
    <Content title={<h1>Contracts</h1>}></Content>
  </>
);

export default Contracts;
