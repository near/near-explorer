import Head from "next/head";

import Mixpanel from "../../libraries/mixpanel";

import Content from "../../components/utils/Content";
import Transactions from "../../components/transactions/Transactions";

class TransactionsPage extends React.Component {
  render() {
    Mixpanel.track("Explorer View Transactions Page");
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

export default TransactionsPage;
