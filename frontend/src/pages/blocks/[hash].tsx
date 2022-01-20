import BN from "bn.js";

import Head from "next/head";

import TransactionIcon from "../../../public/static/images/icon-t-transactions.svg";

import BlocksApi, { BlockInfo } from "../../libraries/explorer-wamp/blocks";

import BlockDetails from "../../components/blocks/BlockDetails";
import ReceiptsInBlock from "../../components/blocks/ReceiptsInBlock";
import Transactions from "../../components/transactions/Transactions";
import Content from "../../components/utils/Content";

import { useTranslation } from "react-i18next";
import { GetServerSideProps, NextPage } from "next";
import { useAnalyticsTrackOnMount } from "../../hooks/analytics/use-analytics-track-on-mount";

type SuccessfulProps = Omit<
  BlockInfo,
  "totalSupply" | "gasPrice" | "gasUsed"
> & {
  totalSupply: string;
  gasPrice: string;
  gasUsed: string;
};

type FailedProps = {
  hash: string;
  err: unknown;
};

type Props = SuccessfulProps | FailedProps;

const BlockDetail: NextPage<Props> = (props) => {
  const { t } = useTranslation();
  useAnalyticsTrackOnMount("Explorer View Individual Block", {
    block: props.hash,
  });

  // Prepare the block object with all the right types and field names on render() since
  // `getInitialProps` can only return basic types to be serializable after Server-side Rendering
  const block =
    "err" in props
      ? undefined
      : {
          hash: props.hash,
          height: props.height,
          timestamp: props.timestamp,
          prevHash: props.prevHash,
          transactionsCount: props.transactionsCount,
          totalSupply: new BN(props.totalSupply),
          gasPrice: new BN(props.gasPrice),
          gasUsed: new BN(props.gasUsed),
          authorAccountId: props.authorAccountId,
          receiptsCount: props.receiptsCount,
        };

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
            size="medium"
            icon={<TransactionIcon style={{ width: "22px" }} />}
            title={<h2>{t("common.transactions.transactions")}</h2>}
          >
            <Transactions blockHash={props.hash} count={1000} />
          </Content>

          <Content
            size="medium"
            icon={<TransactionIcon style={{ width: "22px" }} />}
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
  const hash = params!.hash;
  try {
    const block = await new BlocksApi(req).getBlockInfo(hash);
    return {
      props: {
        ...block,
        // the return value should be a serializable object per Next.js documentation, so we map BN to strings
        totalSupply: block.totalSupply.toString(),
        gasPrice: block.gasPrice.toString(),
        gasUsed: block.gasUsed.toString(),
      },
    };
  } catch (err) {
    return {
      props: { hash, err: String(err) },
    };
  }
};

export default BlockDetail;
