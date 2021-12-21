import Head from "next/head";
import { useEffect } from "react";
import Mixpanel from "../../libraries/mixpanel";

import Content from "../../components/utils/Content";

import PartnerTotalTransactionList from "../../components/stats/PartnerTotalTransactionList";
import PartnerFirst3MonthTransactionslist from "../../components/stats/PartnerFirst3MonthTransactionsList";
import { NextPage } from "next";

const Partner: NextPage = () => {
  useEffect(() => {
    Mixpanel.track("Explorer View Partner page");
  }, []);

  return (
    <>
      <Head>
        <title>NEAR Explorer | Partner Project Stats</title>
      </Head>
      <Content title={<h1>Partner Project Stats</h1>}>
        <div id="partnerTotalTransactions">
          <PartnerTotalTransactionList />
        </div>
        <hr />
        <div id="partnerFirst3Month">
          <PartnerFirst3MonthTransactionslist />
        </div>
      </Content>
    </>
  );
};

export default Partner;
