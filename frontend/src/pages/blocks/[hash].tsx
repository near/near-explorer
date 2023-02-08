import Head from "next/head";

import TransactionIconSvg from "@explorer/frontend/public/static/images/icon-t-transactions.svg";

import BlockDetails from "@explorer/frontend/components/blocks/BlockDetails";
import ReceiptsIncludedInBlock from "@explorer/frontend/components/receipts/ReceiptsIncludedInBlock";
import ReceiptsExecutedInBlock from "@explorer/frontend/components/receipts/ReceiptsExecutedInBlock";
import Transactions, {
  getNextPageParam,
} from "@explorer/frontend/components/transactions/Transactions";
import Content from "@explorer/frontend/components/utils/Content";

import { useTranslation } from "react-i18next";
import { NextPage } from "next";
import { useAnalyticsTrackOnMount } from "@explorer/frontend/hooks/analytics/use-analytics-track-on-mount";
import { trpc } from "@explorer/frontend/libraries/trpc";
import { styled } from "@explorer/frontend/libraries/styles";
import * as React from "react";
import { useRouter } from "next/router";

const TransactionIcon = styled(TransactionIconSvg, {
  width: 22,
});

const TRANSACTIONS_PER_PAGE = 1000;

const BlockDetail: NextPage = React.memo(() => {
  const hash = useRouter().query.hash as string;
  const { t } = useTranslation();
  useAnalyticsTrackOnMount("Explorer View Individual Block", {
    block: hash,
  });
  const blockQuery = trpc.useQuery(["block.byId", { hash }]);
  const query = trpc.useInfiniteQuery(
    [
      "transaction.listByBlockHash",
      { blockHash: hash, limit: TRANSACTIONS_PER_PAGE },
    ],
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
        {!blockQuery.data ? (
          <>{t("page.blocks.error.block_fetching")}</>
        ) : (
          <BlockDetails block={blockQuery.data} />
        )}
      </Content>
      {!blockQuery.isError ? (
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

export default BlockDetail;
