import Head from "next/head";
import { Component } from "react";
import Mixpanel from "../../libraries/mixpanel";

import Content from "../../components/utils/Content";
import Transactions from "../../components/transactions/Transactions";

import { Translate } from "react-localize-redux";

class TransactionsPage extends Component {
  componentDidMount() {
    Mixpanel.track("Explorer View Transactions Page");
  }

  render() {
    return (
      <Translate>
        {({ translate }) => (
          <>
            <Head>
              <title>NEAR Explorer | Transactions</title>
            </Head>
            <Content
              title={<h1>{translate("common.transactions.transactions")}</h1>}
            >
              <Transactions />
            </Content>
          </>
        )}
      </Translate>
    );
  }
}

export default TransactionsPage;
