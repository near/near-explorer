import Head from "next/head";
import { useRouter } from "next/router";

import * as React from "react";
import * as ReactQuery from "react-query";
import { useTranslation } from "react-i18next";
import { NextPage } from "next";

import { Transaction } from "@explorer/common/types/procedures";
import { useAnalyticsTrackOnMount } from "@explorer/frontend/hooks/analytics/use-analytics-track-on-mount";

import TransactionHeader from "@explorer/frontend/components/beta/transactions/TransactionHeader";
import TransactionActionsList from "@explorer/frontend/components/beta/transactions/TransactionActionsList";
import { trpc } from "@explorer/frontend/libraries/trpc";
import { styled } from "@explorer/frontend/libraries/styles";
import { Spinner } from "react-bootstrap";

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

  const transactionQuery = trpc.useQuery(["transaction.byHash", { hash }]);

  return (
    <>
      <Head>
        <title>NEAR Explorer Beta | Transaction</title>
      </Head>
      <link
        href="https://fonts.googleapis.com/css2?family=Manrope&display=swap"
        rel="stylesheet"
      />
      <Wrapper>
        <TransactionQueryView {...transactionQuery} hash={hash} />
      </Wrapper>
    </>
  );
});

type QueryProps = ReactQuery.UseQueryResult<Transaction | null> & {
  hash: string;
};

const TransactionQueryView: React.FC<QueryProps> = React.memo((props) => {
  const { t } = useTranslation();

  switch (props.status) {
    case "success":
      if (props.data) {
        return (
          <>
            <TransactionHeader transaction={props.data} />
            <TransactionActionsList transaction={props.data} />
          </>
        );
      }
      return (
        <div>
          {t("page.transactions.error.transaction_fetching", {
            hash: props.hash,
          })}
        </div>
      );
    case "error":
      return <div>{t("page.transactions.error.transaction_fetching")}</div>;
    case "loading":
      return <Spinner animation="border" />;
    default:
      return null;
  }
});

export default TransactionPage;
