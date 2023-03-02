import * as React from "react";

import { NextPage } from "next";
import Head from "next/head";
import { useTranslation } from "next-i18next";

import Transactions, {
  getNextPageParam,
} from "@explorer/frontend/components/transactions/Transactions";
import Content from "@explorer/frontend/components/utils/Content";
import { useAnalyticsTrackOnMount } from "@explorer/frontend/hooks/analytics/use-analytics-track-on-mount";
import { trpc } from "@explorer/frontend/libraries/trpc";

const TRANSACTIONS_PER_PAGE = 15;

const TransactionsPage: NextPage = React.memo(() => {
  const { t } = useTranslation();
  useAnalyticsTrackOnMount("Explorer View Transactions Page");
  const query = trpc.useInfiniteQuery(
    ["transaction.listByTimestamp", { limit: TRANSACTIONS_PER_PAGE }],
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
