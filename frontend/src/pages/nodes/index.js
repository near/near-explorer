import Head from "next/head";

import Nodes from "../../components/nodes/Nodes";

const Index = props => {
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
