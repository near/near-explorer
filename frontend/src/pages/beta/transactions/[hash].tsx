import Head from "next/head";
import { useRouter } from "next/router";

import * as React from "react";
import * as ReactQuery from "react-query";
import { useTranslation } from "react-i18next";
import { GetServerSideProps, NextPage } from "next";

import { TransactionDetails } from "../../../types/common";
import { useAnalyticsTrackOnMount } from "../../../hooks/analytics/use-analytics-track-on-mount";

import TransactionHeader from "../../../components/beta/transactions/TransactionHeader";
import TransactionActionsList from "../../../components/beta/transactions/TransactionActionsList";
import { trpc } from "../../../libraries/trpc";

type Props = {
  hash: string;
};

const TransactionPage: NextPage<Props> = React.memo((props) => {
  const transactionHash = useRouter().query.hash as string;
  useAnalyticsTrackOnMount("Explorer Beta | Individual Transaction Page", {
    transaction_hash: props.hash,
  });

  const transactionQuery = trpc.useQuery(["transaction", { transactionHash }]);

  return (
    <>
      <Head>
        <title>NEAR Explorer Beta | Transaction</title>
      </Head>
      <link
        href="https://fonts.googleapis.com/css2?family=Manrope&display=swap"
        rel="stylesheet"
      />
      <link href="https://v1.fontapi.ir/css/SFProDisplay" rel="stylesheet" />
      <link href="https://v1.fontapi.ir/css/SFMono" rel="stylesheet" />
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
        console.log("props.data: ", props.data);

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
  {},
  { hash: string }
> = async () => {
  return { props: {} };
};

export default TransactionPage;
