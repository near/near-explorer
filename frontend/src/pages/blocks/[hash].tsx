import Head from "next/head";

import TransactionIconSvg from "../../../public/static/images/icon-t-transactions.svg";

import BlockDetails from "../../components/blocks/BlockDetails";
import ReceiptsIncludedInBlock from "../../components/receipts/ReceiptsIncludedInBlock";
import ReceiptsExecutedInBlock from "../../components/receipts/ReceiptsExecutedInBlock";
import Transactions, {
  Props as TransactionsProps,
} from "../../components/transactions/Transactions";
import Content from "../../components/utils/Content";

import { useTranslation } from "react-i18next";
import { GetServerSideProps, NextPage } from "next";
import { useAnalyticsTrackOnMount } from "../../hooks/analytics/use-analytics-track-on-mount";
import { getPrefetchObject } from "../../libraries/queries";
import { useQuery } from "../../hooks/use-query";
import { styled } from "../../libraries/styles";
import * as React from "react";

const TransactionIcon = styled(TransactionIconSvg, {
  width: 22,
});

type Props = {
  hash: string;
};

const TRANSACTIONS_PER_PAGE = 1000;

const BlockDetail: NextPage<Props> = React.memo((props) => {
  const { t } = useTranslation();
  useAnalyticsTrackOnMount("Explorer View Individual Block", {
    block: props.hash,
  });
  const blockQuery = useQuery("block-info", [props.hash]);
  const fetch = React.useCallback<TransactionsProps["fetch"]>(
    (fetcher, indexer) =>
      fetcher("transactions-list-by-block-hash", [
        props.hash,
        TRANSACTIONS_PER_PAGE,
        indexer ?? null,
      ]),
    [props.hash]
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
              : `${props.hash.substring(0, 7)}...`
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
            <Transactions fetch={fetch} queryKey={["block", props.hash]} />
          </Content>

          <Content
            icon={<TransactionIcon />}
            title={<h2>{t("component.receipts.ReceiptsIncludedInBlock")}</h2>}
          >
            <ReceiptsIncludedInBlock blockHash={props.hash} />
          </Content>

          <Content
            icon={<TransactionIcon />}
            title={<h2>{t("component.receipts.ReceiptsExecutedInBlock")}</h2>}
          >
            <ReceiptsExecutedInBlock blockHash={props.hash} />
          </Content>
        </>
      ) : null}
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
    await prefetchObject.prefetch("block-info", [hash]);
    return {
      props: {
        hash,
        dehydratedState: prefetchObject.dehydrate(),
      },
    };
  } catch (err) {
    return {
      props: {
        hash,
      },
    };
  }
};

export default BlockDetail;
