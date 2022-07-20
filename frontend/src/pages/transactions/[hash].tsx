import Head from "next/head";

import TransactionIconSvg from "../../../public/static/images/icon-t-transactions.svg";

import ActionsList from "../../components/transactions/ActionsList";
import ReceiptRow from "../../components/transactions/ReceiptRow";
import TransactionDetails from "../../components/transactions/TransactionDetails";
import TransactionOutcome from "../../components/transactions/TransactionOutcome";
import Content from "../../components/utils/Content";

import { useTranslation } from "react-i18next";
import { NextPage } from "next";
import { useAnalyticsTrackOnMount } from "../../hooks/analytics/use-analytics-track-on-mount";
import { styled } from "../../libraries/styles";
import * as React from "react";
import { trpc } from "../../libraries/trpc";
import { useRouter } from "next/router";

const TransactionIcon = styled(TransactionIconSvg, {
  width: 22,
});

const TransactionDetailsPage: NextPage = React.memo(() => {
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

export default TransactionDetailsPage;
