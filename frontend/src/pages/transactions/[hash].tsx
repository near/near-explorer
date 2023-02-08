import * as React from "react";

import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

import ActionsList from "@explorer/frontend/components/transactions/ActionsList";
import ReceiptRow from "@explorer/frontend/components/transactions/ReceiptRow";
import TransactionDetails from "@explorer/frontend/components/transactions/TransactionDetails";
import TransactionOutcome from "@explorer/frontend/components/transactions/TransactionOutcome";
import Content from "@explorer/frontend/components/utils/Content";
import { useAnalyticsTrackOnMount } from "@explorer/frontend/hooks/analytics/use-analytics-track-on-mount";
import { useBeta } from "@explorer/frontend/hooks/use-beta";
import { styled } from "@explorer/frontend/libraries/styles";
import { trpc } from "@explorer/frontend/libraries/trpc";
import { default as BetaTransactionPage } from "@explorer/frontend/pages/beta/transactions/[hash]";
import TransactionIconSvg from "@explorer/frontend/public/static/images/icon-t-transactions.svg";

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
  const transaction = transactionQuery.data;

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
        {!transaction ? (
          t("page.transactions.error.transaction_fetching")
        ) : (
          <TransactionDetails transaction={transaction} />
        )}
      </Content>
      {transaction && (
        <Content
          icon={<TransactionIcon />}
          title={<h2>{t("common.actions.actions")}</h2>}
        >
          <ActionsList
            actions={transaction.actions}
            signerId={transaction.signerId}
            receiverId={transaction.receiverId}
            blockTimestamp={transaction.blockTimestamp}
            detalizationMode="minimal"
            showDetails
          />
        </Content>
      )}

      {transaction?.receipt && (
        <Content
          icon={<TransactionIcon />}
          title={<h2>{t("page.transactions.transaction_execution_plan")}</h2>}
        >
          <TransactionOutcome outcome={transaction.outcome} />

          <ReceiptRow
            receipt={transaction.receipt}
            transactionHash={transaction.hash}
          />
        </Content>
      )}
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
