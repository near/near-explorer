import Head from "next/head";

import Content from "../../components/utils/Content";

import PartnerTotalTransactionList from "../../components/stats/PartnerTotalTransactionList";
import PartnerFirst3MonthTransactionslist from "../../components/stats/PartnerFirst3MonthTransactionsList";
import { NextPage } from "next";
import { useAnalyticsTrackOnMount } from "../../hooks/analytics/use-analytics-track-on-mount";
import * as React from "react";

const Partner: NextPage = React.memo(() => {
  useAnalyticsTrackOnMount("Explorer View Partner page");

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
});

export default Partner;
