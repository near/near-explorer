import Head from "next/head";

import Content from "../../components/utils/Content";
import Transactions from "../../components/transactions/Transactions";

import { useTranslation } from "react-i18next";
import { NextPage } from "next";
import { useAnalyticsTrackOnMount } from "../../hooks/analytics/use-analytics-track-on-mount";
import * as React from "react";

const TransactionsPage: NextPage = React.memo(() => {
  const { t } = useTranslation();
  useAnalyticsTrackOnMount("Explorer View Transactions Page");

  return (
    <>
      <Head>
        <title>NEAR Explorer | Transactions</title>
      </Head>
      <Content title={<h1>{t("common.transactions.transactions")}</h1>}>
        <Transactions />
      </Content>
    </>
  );
});

export default TransactionsPage;
