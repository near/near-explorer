import * as React from "react";

import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import Content from "@/frontend/components/utils/Content";
import { getNearNetworkName } from "@/frontend/libraries/config";
import { shortenString } from "@/frontend/libraries/formatting";
import { getTrpcClient } from "@/frontend/libraries/trpc";

const ReceiptRedirectPage: NextPage = React.memo(() => {
  const receiptId = useRouter().query.id as string;
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>NEAR Explorer | Receipt</title>
      </Head>
      <Content
        title={
          <h1>
            {t("common.receipts.receipt")}: {shortenString(receiptId)}
          </h1>
        }
        border={false}
      >
        {t("page.transactions.error.transaction_fetching")}
      </Content>
    </>
  );
});

export const getServerSideProps: GetServerSideProps<
  {},
  { id: string }
> = async ({ req, query, params }) => {
  const receiptId = params?.id ?? "";
  if (!receiptId) {
    return { props: {} };
  }
  const networkName = getNearNetworkName(query, req.headers.host);
  const transactionHash = await getTrpcClient(
    networkName
  ).receipt.getTransactionHash.query({ id: receiptId });
  if (!transactionHash) {
    return { props: {} };
  }
  return {
    redirect: {
      permanent: true,
      destination: `/transactions/${transactionHash}#${receiptId}`,
    },
  };
};

export default ReceiptRedirectPage;
