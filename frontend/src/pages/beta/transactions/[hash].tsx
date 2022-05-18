import Head from "next/head";

import * as React from "react";
import * as ReactQuery from "react-query";
import { useTranslation } from "react-i18next";
import { GetServerSideProps, NextPage } from "next";

import { TransactionDetails } from "../../../types/common";
import { useAnalyticsTrackOnMount } from "../../../hooks/analytics/use-analytics-track-on-mount";
import { getPrefetchObject } from "../../../libraries/queries";

import TransactionHeader from "../../../components/beta/transactions/TransactionHeader";
import TransactionActionsList from "../../../components/beta/transactions/TransactionActionsList";
import { useQuery } from "../../../hooks/use-query";

type Props = {
  hash: string;
};

const TransactionPage: NextPage<Props> = React.memo((props) => {
  useAnalyticsTrackOnMount("Explorer Beta | Individual Transaction Page", {
    transaction_hash: props.hash,
  });

  const transactionQuery = useQuery("transaction", [props.hash]);

  return (
    <>
      <Head>
        <title>NEAR Explorer Beta | Transaction</title>
      </Head>
      <link
        href="https://fonts.googleapis.com/css2?family=Manrope&display=swap"
        rel="stylesheet"
      />
      <TransactionQueryView {...transactionQuery} hash={props.hash} />
    </>
  );
});

type QueryProps = ReactQuery.UseQueryResult<TransactionDetails | null> & {
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
      return <div>Loading...</div>;
    default:
      return null;
  }
});

export const getServerSideProps: GetServerSideProps<
  Props,
  { hash: string }
> = async ({ req, params, query }) => {
  const hash = params?.hash ?? "";
  const prefetchObject = getPrefetchObject(query, req.headers.host);
  await prefetchObject.prefetch("transaction", [hash]);
  return {
    props: {
      hash,
      dehydratedState: prefetchObject.dehydrate(),
    },
  };
};

export default TransactionPage;
