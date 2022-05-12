import Head from "next/head";

import TransactionIconSvg from "../../../public/static/images/icon-t-transactions.svg";

import ActionsList from "../../components/transactions/ActionsList";
import ReceiptRow from "../../components/transactions/ReceiptRow";
import TransactionDetails from "../../components/transactions/TransactionDetails";
import TransactionOutcome from "../../components/transactions/TransactionOutcome";
import Content from "../../components/utils/Content";

import { useTranslation } from "react-i18next";
import { GetServerSideProps, NextPage } from "next";
import { useAnalyticsTrackOnMount } from "../../hooks/analytics/use-analytics-track-on-mount";
import { getPrefetchObject } from "../../libraries/queries";
import { styled } from "../../libraries/styles";
import * as React from "react";
import { useQuery } from "../../hooks/use-query";

const TransactionIcon = styled(TransactionIconSvg, {
  width: 22,
});

type Props = {
  hash: string;
};

const TransactionDetailsPage: NextPage<Props> = React.memo((props) => {
  const { t } = useTranslation();
  useAnalyticsTrackOnMount("Explorer View Individual Transaction Page", {
    transaction_hash: props.hash,
  });
  const transactionQuery = useQuery("transaction-info", [props.hash]);
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
            {`: ${props.hash.substring(0, 7)}...${props.hash.substring(
              props.hash.length - 4
            )}`}
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
          {transaction.transactionOutcome && (
            <TransactionOutcome transaction={transaction.transactionOutcome} />
          )}

          <ReceiptRow
            receipt={transaction.receipt}
            transactionHash={transaction.hash}
          />
        </Content>
      )}
    </>
  );
});

export const getServerSideProps: GetServerSideProps<
  Props,
  { hash: string }
> = async ({ req, params, query }) => {
  const hash = params?.hash ?? "";
  try {
    const prefetchObject = getPrefetchObject(query, req.headers.host);
    await prefetchObject.prefetch("transaction-info", [hash]);
    return {
      props: {
        hash,
        dehydratedState: prefetchObject.dehydrate(),
      },
    };
  } catch (err) {
    return {
      props: { hash, err: String(err) },
    };
  }
};

export default TransactionDetailsPage;
