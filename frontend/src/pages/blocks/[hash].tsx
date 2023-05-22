import * as React from "react";

import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { stringify } from "querystring";

import BlockDetails from "@/frontend/components/blocks/BlockDetails";
import ReceiptsExecutedInBlock from "@/frontend/components/receipts/ReceiptsExecutedInBlock";
import ReceiptsIncludedInBlock from "@/frontend/components/receipts/ReceiptsIncludedInBlock";
import Transactions, {
  getNextPageParam,
} from "@/frontend/components/transactions/Transactions";
import Content from "@/frontend/components/utils/Content";
import ErrorMessage from "@/frontend/components/utils/ErrorMessage";
import { useAnalyticsTrackOnMount } from "@/frontend/hooks/analytics/use-analytics-track-on-mount";
import { getNearNetworkName } from "@/frontend/libraries/config";
import { styled } from "@/frontend/libraries/styles";
import { getTrpcClient, trpc } from "@/frontend/libraries/trpc";
import TransactionIconSvg from "@/frontend/public/static/images/icon-t-transactions.svg";

const TransactionIcon = styled(TransactionIconSvg, {
  width: 22,
});

const TRANSACTIONS_PER_PAGE = 20;

const isHeight = (hashOrHeight: string) => /^\d+$/.test(hashOrHeight);

const BlockDetail = React.memo<{ hash: string }>(({ hash }) => {
  const { t } = useTranslation();
  useAnalyticsTrackOnMount("Explorer View Individual Block", {
    block: hash,
  });
  const blockQuery = trpc.block.byId.useQuery({ hash });
  const query = trpc.transaction.listByBlockHash.useInfiniteQuery(
    { blockHash: hash, limit: TRANSACTIONS_PER_PAGE },
    { getNextPageParam }
  );

  return (
    <>
      <Head>
        <title>NEAR Explorer | Block</title>
      </Head>
      <Content
        title={
          <h1>{`${t("page.blocks.title")} ${
            blockQuery.data
              ? `#${blockQuery.data.height}`
              : `${hash.substring(0, 7)}...`
          }`}</h1>
        }
        border={false}
      >
        {blockQuery.status === "loading" ? (
          t("page.blocks.error.block_fetching")
        ) : blockQuery.status === "error" ? (
          <ErrorMessage onRetry={blockQuery.refetch}>
            {blockQuery.error.message}
          </ErrorMessage>
        ) : blockQuery.data ? (
          <BlockDetails block={blockQuery.data} />
        ) : (
          t("page.blocks.error.notFound")
        )}
      </Content>
      {blockQuery.status === "success" ? (
        <>
          <Content
            icon={<TransactionIcon />}
            title={<h2>{t("common.transactions.transactions")}</h2>}
          >
            <Transactions query={query} />
          </Content>

          <Content
            icon={<TransactionIcon />}
            title={<h2>{t("component.receipts.ReceiptsIncludedInBlock")}</h2>}
          >
            <ReceiptsIncludedInBlock blockHash={hash} />
          </Content>

          <Content
            icon={<TransactionIcon />}
            title={<h2>{t("component.receipts.ReceiptsExecutedInBlock")}</h2>}
          >
            <ReceiptsExecutedInBlock blockHash={hash} />
          </Content>
        </>
      ) : null}
    </>
  );
});

type Props = {
  // tRPC and Next.js prerender page before getServerSideProps kicks in
  heightVerified: boolean;
};

const BlockPage: NextPage<Props> = React.memo(({ heightVerified }) => {
  const hash = useRouter().query.hash as string;
  if (isHeight(hash) && !heightVerified) {
    return null;
  }
  return <BlockDetail hash={hash} />;
});

export const getServerSideProps: GetServerSideProps<
  Props,
  { hash: string }
> = async (context) => {
  const hashOrHeight = context.params?.hash ?? "";
  if (isHeight(hashOrHeight)) {
    const networkName = getNearNetworkName(
      context.query,
      context.req.headers.host
    );
    const block = await getTrpcClient(networkName).block.byId.query({
      height: Number(hashOrHeight),
    });
    if (!block) {
      // 404 is managed by the page itself
      return { props: { heightVerified: true } };
    }
    return {
      redirect: {
        permanent: true,
        destination: `/blocks/${block.hash}${`?${stringify(context.query)}`}`,
      },
    };
  }
  return { props: { heightVerified: true } };
};

export default BlockPage;
