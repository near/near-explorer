import Head from "next/head";

import Content from "../../components/utils/Content";
import Transactions from "../../components/transactions/Transactions";

export default class extends React.Component {
  render() {
    return (
      <>
        <Head>
          <title>Near Explorer | Transactions</title>
        </Head>
        <Content title={<h1>Transactions</h1>}>
          <Transactions />
        </Content>
      </>
    );
  }
}
