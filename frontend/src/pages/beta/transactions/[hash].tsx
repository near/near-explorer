import Head from "next/head";

import * as React from "react";
import * as ReactQuery from "react-query";
import { useTranslation } from "react-i18next";
import { GetServerSideProps, NextPage } from "next";

import { transactionByHashQuery } from "../../../providers/transactions";
import { useAnalyticsTrackOnMount } from "../../../hooks/analytics/use-analytics-track-on-mount";

import { useQuery } from "../../../hooks/use-query";
import {
  createServerQueryClient,
  getPrefetchObject,
} from "../../../libraries/queries";
import { TransactionHash } from "../../../types/nominal";
import {
  Transaction,
  TransactionErrorResponse,
} from "../../../types/transaction";

import TransactionHeader from "../../../components/beta/transactions/TransactionHeader";
import TransactionActionsList from "../../../components/beta/transactions/TransactionActionsList";

type Props = {
  hash: TransactionHash;
};

const TransactionPage: NextPage<Props> = React.memo((props) => {
  useAnalyticsTrackOnMount("Explorer Beta | Individual Transaction Page", {
    transaction_hash: props.hash,
  });

  const transactionQuery = useQuery(transactionByHashQuery, props.hash);

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

type QueryProps = ReactQuery.UseQueryResult<
  Transaction | null,
  TransactionErrorResponse
> & {
  hash: TransactionHash;
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
  { hash: TransactionHash }
> = async ({ req, params }) => {
  const hash = params?.hash ?? ("" as TransactionHash);
  const queryClient = createServerQueryClient();
  const prefetchObject = getPrefetchObject(queryClient, req);
  await prefetchObject.fetch(transactionByHashQuery, hash);
  return {
    props: {
      hash,
      dehydratedState: prefetchObject.getDehydratedState(),
    },
  };
};

export default TransactionPage;
