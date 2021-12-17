import BN from "bn.js";

import Head from "next/head";

import { Component } from "react";

import Mixpanel from "../../libraries/mixpanel";

import TransactionIcon from "../../../public/static/images/icon-t-transactions.svg";

import BlocksApi, { BlockInfo } from "../../libraries/explorer-wamp/blocks";

import BlockDetails from "../../components/blocks/BlockDetails";
import ReceiptsInBlock from "../../components/blocks/ReceiptsInBlock";
import Transactions from "../../components/transactions/Transactions";
import Content from "../../components/utils/Content";

import { Translate } from "react-localize-redux";
import { NextPageContext } from "next";

type SuccessfulProps = BlockInfo & {
  totalSupply: string;
  gasPrice: string;
  gasUsed: string;
};

type FailedProps = {
  hash: string;
  err: unknown;
};

type Props = SuccessfulProps | FailedProps;

class BlockDetail extends Component<Props> {
  static async getInitialProps({
    req,
    query: { hash: rawHash },
  }: NextPageContext) {
    const hash = rawHash as string;
    try {
      const block = await new BlocksApi(req).getBlockInfo(hash);
      return {
        ...block,
        // the return value should be a serializable object per Next.js documentation, so we map BN to strings
        totalSupply: block.totalSupply.toString(),
        gasPrice: block.gasPrice.toString(),
        gasUsed: block.gasUsed.toString(),
      };
    } catch (err) {
      return { hash, err };
    }
  }

  componentDidMount() {
    Mixpanel.track("Explorer View Individual Block", {
      block: this.props.hash,
    });
  }

  render() {
    // Prepare the block object with all the right types and field names on render() since
    // `getInitialProps` can only return basic types to be serializable after Server-side Rendering
    const block =
      "err" in this.props
        ? undefined
        : {
            hash: this.props.hash,
            height: this.props.height,
            timestamp: this.props.timestamp,
            prevHash: this.props.prevHash,
            transactionsCount: this.props.transactionsCount,
            totalSupply: new BN(this.props.totalSupply),
            gasPrice: new BN(this.props.gasPrice),
            gasUsed: new BN(this.props.gasUsed),
            authorAccountId: this.props.authorAccountId,
            receiptsCount: this.props.receiptsCount,
          };

    return (
      <Translate>
        {({ translate }) => (
          <>
            <Head>
              <title>NEAR Explorer | Block</title>
            </Head>
            <Content
              title={
                <h1>{`${translate("page.blocks.title").toString()} ${
                  block
                    ? `#${block.height}`
                    : `${this.props.hash.substring(0, 7)}...`
                }`}</h1>
              }
              border={false}
            >
              {!block ? (
                <>{translate("page.blocks.error.block_fetching")}</>
              ) : (
                <BlockDetails block={block} />
              )}
            </Content>
            {!("err" in this.props) ? (
              <>
                <Content
                  size="medium"
                  icon={<TransactionIcon style={{ width: "22px" }} />}
                  title={
                    <h2>{translate("common.transactions.transactions")}</h2>
                  }
                >
                  <Transactions blockHash={this.props.hash} count={1000} />
                </Content>

                <Content
                  size="medium"
                  icon={<TransactionIcon style={{ width: "22px" }} />}
                  title={<h2>{translate("common.receipts.receipts")}</h2>}
                >
                  <ReceiptsInBlock blockHash={this.props.hash} />
                </Content>
              </>
            ) : null}
          </>
        )}
      </Translate>
    );
  }
}

export default BlockDetail;
