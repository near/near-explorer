import Head from "next/head";

import Mixpanel from "../../libraries/mixpanel";

import Content from "../../components/utils/Content";
import Transactions from "../../components/transactions/Transactions";

class TransactionsPage extends React.Component {
  componentDidMount() {
    Mixpanel.track("Explorer View Transactions Page");
  }

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

export default TransactionsPage;
