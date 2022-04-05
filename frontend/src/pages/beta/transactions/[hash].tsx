import Head from "next/head";

import * as React from "react";
import * as ReactQuery from "react-query";
import { useTranslation } from "react-i18next";
import { GetServerSideProps, NextPage } from "next";
import { IncomingMessage } from "http";

import { getTransaction } from "../../../providers/transactions";
import { useAnalyticsTrackOnMount } from "../../../hooks/analytics/use-analytics-track-on-mount";
import wampApi from "../../../libraries/wamp/api";
import { getNearNetwork } from "../../../libraries/config";
import {
  createServerQueryClient,
  serverPrefetchTimeout,
} from "../../../libraries/pages";
import { TransactionId } from "../../../libraries/types";

import TransactionHeader from "../../../components/beta/transactions/TransactionHeader";
import TransactionContent from "../../../components/beta/transactions/TransactionContent";

type Props = {
  hash: TransactionId;
};

const getTransactionQueryKey = (hash: TransactionId) => ["transaction", hash];
const getTransactionByHash = async (
  hash: TransactionId,
  req?: IncomingMessage
) => getTransaction(wampApi.getCall(getNearNetwork(req)), hash);

const TransactionPage: NextPage<Props> = React.memo((props) => {
  useAnalyticsTrackOnMount("Explorer Beta | Individual Transaction Page", {
    transaction_hash: props.hash,
  });

  const transactionQuery = ReactQuery.useQuery(
    getTransactionQueryKey(props.hash),
    () => getTransactionByHash(props.hash)
  );

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

const TransactionQueryView = React.memo((props) => {
  const { t } = useTranslation();

  switch (props.status) {
    case "success":
      if (props.data) {
        console.log("TransactionQueryView | props", props);
        return (
          <>
            <TransactionHeader transaction={props.data} />
            <TransactionContent transaction={props.data} />
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
  { hash: TransactionId }
> = async ({ req, params }) => {
  const hash = params?.hash ?? ("" as TransactionId);
  console.log("id", hash);

  const queryClient = createServerQueryClient();
  await queryClient.prefetchQuery(
    getTransactionQueryKey(hash),
    serverPrefetchTimeout(() => getTransactionByHash(hash, req))
  );
  return {
    props: {
      hash,
      dehydratedState: ReactQuery.dehydrate(queryClient),
    },
  };
};

export default TransactionPage;
