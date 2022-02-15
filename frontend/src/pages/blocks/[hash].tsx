import Head from "next/head";

import TransactionIconSvg from "../../../public/static/images/icon-t-transactions.svg";

import BlockDetails from "../../components/blocks/BlockDetails";
import ReceiptsInBlock from "../../components/blocks/ReceiptsInBlock";
import Transactions from "../../components/transactions/Transactions";
import Content from "../../components/utils/Content";

import { useTranslation } from "react-i18next";
import { GetServerSideProps, NextPage } from "next";
import { useAnalyticsTrackOnMount } from "../../hooks/analytics/use-analytics-track-on-mount";
import { getNearNetwork } from "../../libraries/config";
import wampApi from "../../libraries/wamp/api";
import { Block, getBlock } from "../../providers/blocks";
import { styled } from "../../libraries/styles";

const TransactionIcon = styled(TransactionIconSvg, {
  width: 22,
});

type Props = {
  hash: string;
  block?: Block;
  err?: unknown;
};

const BlockDetail: NextPage<Props> = (props) => {
  const { t } = useTranslation();
  useAnalyticsTrackOnMount("Explorer View Individual Block", {
    block: props.hash,
  });
  const block = props.block;

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
            <Transactions blockHash={props.hash} count={1000} />
          </Content>

          <Content
            icon={<TransactionIcon />}
            title={<h2>{t("common.receipts.receipts")}</h2>}
          >
            <ReceiptsInBlock blockHash={props.hash} />
          </Content>
        </>
      ) : null}
    </>
  );
};

export const getServerSideProps: GetServerSideProps<
  Props,
  { hash: string }
> = async ({ req, params }) => {
  const hash = params?.hash ?? "";
  try {
    const nearNetwork = getNearNetwork(req);
    const block = await getBlock(wampApi.getCall(nearNetwork), hash);
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
