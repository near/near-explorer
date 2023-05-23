import * as React from "react";

import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { Spinner } from "react-bootstrap";

import { TRPCQueryResult } from "@/common/types/trpc";
import TransactionActionsList from "@/frontend/components/beta/transactions/TransactionActionsList";
import TransactionHeader from "@/frontend/components/beta/transactions/TransactionHeader";
import { useAnalyticsTrackOnMount } from "@/frontend/hooks/analytics/use-analytics-track-on-mount";
import { styled } from "@/frontend/libraries/styles";
import { trpc } from "@/frontend/libraries/trpc";

type QueryProps = {
  query: TRPCQueryResult<"transaction.byHash">;
};

const TransactionQueryView: React.FC<QueryProps> = React.memo(({ query }) => {
  const { t } = useTranslation();

  switch (query.status) {
    case "success":
      if (!query.data) {
        return <>{t("page.transactions.error.notFound")}</>;
      }
      return (
        <>
          <TransactionHeader transaction={query.data} />
          <TransactionActionsList transaction={query.data} />
        </>
      );
    case "error":
      return <>{query.error.message}</>;
    case "loading":
      return <Spinner animation="border" />;
  }
});

const Wrapper = styled("div", {
  backgroundColor: "#fff",
  padding: "12px 6vw",
  fontFamily: "Manrope",
});

const TransactionPage: NextPage = React.memo(() => {
  const hash = useRouter().query.hash as string;
  useAnalyticsTrackOnMount("Explorer Beta | Individual Transaction Page", {
    transaction_hash: hash,
  });

  const transactionQuery = trpc.transaction.byHash.useQuery({ hash });

  return (
    <>
      <Head>
        <title>NEAR Explorer Beta | Transaction</title>
      </Head>
      <Wrapper>
        <TransactionQueryView query={transactionQuery} />
      </Wrapper>
    </>
  );
});

export default TransactionPage;
