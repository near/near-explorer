import Head from "next/head";

import Content from "../../components/utils/Content";
import Transactions, {
  Props as TransactionsProps,
} from "../../components/transactions/Transactions";

import { useTranslation } from "react-i18next";
import { NextPage } from "next";
import { useAnalyticsTrackOnMount } from "../../hooks/analytics/use-analytics-track-on-mount";
import * as React from "react";

const TRANSACTIONS_PER_PAGE = 15;

const TransactionsPage: NextPage = React.memo(() => {
  const { t } = useTranslation();
  useAnalyticsTrackOnMount("Explorer View Transactions Page");
  const fetch = React.useCallback<TransactionsProps["fetch"]>(
    (fetcher, indexer) =>
      fetcher("transactions-list", [TRANSACTIONS_PER_PAGE, indexer ?? null]),
    []
  );

  return (
    <>
      <Head>
        <title>NEAR Explorer | Transactions</title>
      </Head>
      <Content title={<h1>{t("common.transactions.transactions")}</h1>}>
        <Transactions fetch={fetch} />
      </Content>
    </>
  );
});

export default TransactionsPage;
