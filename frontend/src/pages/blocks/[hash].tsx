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
import { getNearNetworkName } from "../../libraries/config";
import { getFetcher } from "../../libraries/transport";
import { Block } from "../../types/common";
import { styled } from "../../libraries/styles";
import * as React from "react";

const TransactionIcon = styled(TransactionIconSvg, {
  width: 22,
});

type Props = {
  hash: string;
  block?: Block;
  err?: unknown;
};

const TRANSACTIONS_PER_PAGE = 1000;

const BlockDetail: NextPage<Props> = React.memo((props) => {
  const { t } = useTranslation();
  useAnalyticsTrackOnMount("Explorer View Individual Block", {
    block: props.hash,
  });
  const block = props.block;
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
            block ? `#${block.height}` : `${props.hash.substring(0, 7)}...`
          }`}</h1>
        }
        border={false}
      >
        {!block ? (
          <>{t("page.blocks.error.block_fetching")}</>
        ) : (
          <BlockDetails block={block} />
        )}
      </Content>
      {!("err" in props) ? (
        <>
          <Content
            icon={<TransactionIcon />}
            title={<h2>{t("common.transactions.transactions")}</h2>}
          >
            <Transactions fetch={fetch} />
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
    const networkName = getNearNetworkName(query, req.headers.host);
    const fetcher = getFetcher(networkName);
    const block = await fetcher("block-info", [hash]);
    if (!block) {
      return {
        props: {
          hash,
          err: `Block "${hash}" is not found`,
        },
      };
    }
    return {
      props: { hash: block.hash, block },
    };
  } catch (err) {
    return {
      props: { hash, err: String(err) },
    };
  }
};

export default BlockDetail;
