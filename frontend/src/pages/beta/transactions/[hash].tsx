import * as React from "react";

import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { Spinner } from "react-bootstrap";
import * as ReactQuery from "react-query";

import { Transaction } from "@explorer/common/types/procedures";
import TransactionActionsList from "@explorer/frontend/components/beta/transactions/TransactionActionsList";
import TransactionHeader from "@explorer/frontend/components/beta/transactions/TransactionHeader";
import { useAnalyticsTrackOnMount } from "@explorer/frontend/hooks/analytics/use-analytics-track-on-mount";
import { styled } from "@explorer/frontend/libraries/styles";
import { trpc } from "@explorer/frontend/libraries/trpc";

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
      <Wrapper>
        <TransactionQueryView {...transactionQuery} hash={hash} />
      </Wrapper>
    </>
  );
});

export default TransactionPage;
