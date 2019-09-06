import Head from "next/head";

import Nodes from "../../components/Nodes";

import "bootstrap/dist/css/bootstrap.min.css";

const Index = ({ nodes, total }) => {
  return (
    <>
      <Head>
        <title>Near Explorer | Nodes</title>
      </Head>
      <Nodes />
    </>
  );
};

export default Index;
