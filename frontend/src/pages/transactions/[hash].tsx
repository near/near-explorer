import * as React from "react";

import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import ActionsList from "@/frontend/components/transactions/ActionsList";
import ReceiptRow from "@/frontend/components/transactions/ReceiptRow";
import TransactionDetails from "@/frontend/components/transactions/TransactionDetails";
import TransactionOutcome from "@/frontend/components/transactions/TransactionOutcome";
import Content from "@/frontend/components/utils/Content";
import ErrorMessage from "@/frontend/components/utils/ErrorMessage";
import { useAnalyticsTrackOnMount } from "@/frontend/hooks/analytics/use-analytics-track-on-mount";
import { useBeta } from "@/frontend/hooks/use-beta";
import { styled } from "@/frontend/libraries/styles";
import { trpc } from "@/frontend/libraries/trpc";
import BetaTransactionPage from "@/frontend/pages/beta/transactions/[hash]";
import TransactionIconSvg from "@/frontend/public/static/images/icon-t-transactions.svg";

const TransactionIcon = styled(TransactionIconSvg, {
  width: 22,
});

const TransactionDetailsPage = React.memo(() => {
  const hash = useRouter().query.hash as string;
  const { t } = useTranslation();
  useAnalyticsTrackOnMount("Explorer View Individual Transaction Page", {
    transaction_hash: hash,
  });
  const transactionQuery = trpc.useQuery(["transaction.byHashOld", { hash }]);

  return (
    <>
      <Head>
        <title>NEAR Explorer | Transaction</title>
      </Head>
      <Content
        title={
          <h1>
            {t("common.transactions.transaction")}
            {`: ${hash.substring(0, 7)}...${hash.substring(hash.length - 4)}`}
          </h1>
        }
        border={false}
      >
        {transactionQuery.status === "loading" ||
        transactionQuery.status === "idle" ? (
          t("page.transactions.error.transaction_fetching")
        ) : transactionQuery.status === "error" ? (
          <ErrorMessage onRetry={transactionQuery.refetch}>
            {transactionQuery.error.message}
          </ErrorMessage>
        ) : transactionQuery.data ? (
          <TransactionDetails transaction={transactionQuery.data} />
        ) : (
          t("page.transactions.error.notFound")
        )}
      </Content>
      {transactionQuery.data ? (
        <>
          <Content
            icon={<TransactionIcon />}
            title={<h2>{t("common.actions.actions")}</h2>}
          >
            <ActionsList
              actions={transactionQuery.data.actions}
              signerId={transactionQuery.data.signerId}
              receiverId={transactionQuery.data.receiverId}
              blockTimestamp={transactionQuery.data.blockTimestamp}
              detalizationMode="minimal"
              showDetails
            />
          </Content>
          <Content
            icon={<TransactionIcon />}
            title={<h2>{t("page.transactions.transaction_execution_plan")}</h2>}
          >
            <TransactionOutcome outcome={transactionQuery.data.outcome} />

            <ReceiptRow
              receipt={transactionQuery.data.receipt}
              transactionHash={transactionQuery.data.hash}
            />
          </Content>
        </>
      ) : null}
    </>
  );
});

const TransactionDetailsWithBeta: NextPage = () => {
  const isBeta = useBeta();
  if (isBeta) {
    return <BetaTransactionPage />;
  }
  return <TransactionDetailsPage />;
};

export default TransactionDetailsWithBeta;
