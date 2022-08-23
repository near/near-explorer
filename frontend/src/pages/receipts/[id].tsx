import * as React from "react";

import { useTranslation } from "react-i18next";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import Content from "../../components/utils/Content";
import { getTrpcClient } from "../../libraries/trpc";
import { getNearNetworkName } from "../../libraries/config";
import { shortenString } from "../../libraries/formatting";

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
  const transactionHash = await getTrpcClient(networkName).query(
    "receipt.getTransactionHash",
    { id: receiptId }
  );
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
