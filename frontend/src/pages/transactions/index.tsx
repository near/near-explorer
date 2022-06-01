import Head from "next/head";

import Content from "../../components/utils/Content";
import Transactions, {
  getNextPageParam,
} from "../../components/transactions/Transactions";

import { useTranslation } from "react-i18next";
import { NextPage } from "next";
import { useAnalyticsTrackOnMount } from "../../hooks/analytics/use-analytics-track-on-mount";
import * as React from "react";
import { trpc } from "../../libraries/trpc";

const TRANSACTIONS_PER_PAGE = 15;

const TransactionsPage: NextPage = React.memo(() => {
  const { t } = useTranslation();
  useAnalyticsTrackOnMount("Explorer View Transactions Page");
  const query = trpc.useInfiniteQuery(
    ["transactions-list", { limit: TRANSACTIONS_PER_PAGE }],
    { getNextPageParam }
  );

  return (
    <>
      <Head>
        <title>NEAR Explorer | Transactions</title>
      </Head>
      <Content title={<h1>{t("common.transactions.transactions")}</h1>}>
        <Transactions query={query} />
      </Content>
    </>
  );
});

export default TransactionsPage;
