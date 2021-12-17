import Head from "next/head";
import { useEffect } from "react";
import Mixpanel from "../../libraries/mixpanel";

import Content from "../../components/utils/Content";
import Transactions from "../../components/transactions/Transactions";

import { Translate } from "react-localize-redux";
import { NextPage } from "next";

const TransactionsPage: NextPage = () => {
  useEffect(() => {
    Mixpanel.track("Explorer View Transactions Page");
  }, []);

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
};

export default TransactionsPage;
