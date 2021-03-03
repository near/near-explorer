import Head from "next/head";

import Content from "../../components/utils/Content";
import Transactions from "../../components/transactions/Transactions";

class Transactions extends React.Component {
  render() {
    return (
      <>
        <Head>
          <title>NEAR Explorer | Transactions</title>
        </Head>
        <Content title={<h1>Transactions</h1>}>
          <Transactions />
        </Content>
      </>
    );
  }
}

export default Transactions;
