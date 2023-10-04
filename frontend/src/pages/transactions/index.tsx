import * as React from "react";

import { NextPage } from "next";
import Head from "next/head";
import { useTranslation } from "next-i18next";

import { ExplorerSunsetBanner } from "@/frontend/components/common/ExplorerSunsetBanner";
import {
  Transactions,
  getNextPageParam,
} from "@/frontend/components/transactions/Transactions";
import { Content } from "@/frontend/components/utils/Content";
import { useAnalyticsTrackOnMount } from "@/frontend/hooks/analytics/use-analytics-track-on-mount";
import { trpc } from "@/frontend/libraries/trpc";

const TRANSACTIONS_PER_PAGE = 15;

const TransactionsPage: NextPage = React.memo(() => {
  const { t } = useTranslation();
  useAnalyticsTrackOnMount("Explorer View Transactions Page");
  const query = trpc.transaction.listByTimestamp.useInfiniteQuery(
    { limit: TRANSACTIONS_PER_PAGE },
    { getNextPageParam }
  );

  return (
    <>
      <Head>
        <title>NEAR Explorer | Transactions</title>
      </Head>
      <div style={{ maxWidth: "1110px", margin: "0 auto" }}>
        <ExplorerSunsetBanner /> {/* Add the banner component here */}
      </div>
      <Content title={<h1>{t("common.transactions.transactions")}</h1>}>
        <Transactions query={query} />
      </Content>
    </>
  );
});

export default TransactionsPage;
