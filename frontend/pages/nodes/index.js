import Head from "next/head";

import Nodes from "../../components/Nodes";

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
