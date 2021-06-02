import BN from "bn.js";

import Head from "next/head";

import React from "react";

import Mixpanel from "../../libraries/mixpanel";

import TransactionIcon from "../../../public/static/images/icon-t-transactions.svg";

import BlocksApi from "../../libraries/explorer-wamp/blocks";

import BlockDetails from "../../components/blocks/BlockDetails";
import Receipts from "../../components/blocks/Receipts";
import Transactions from "../../components/transactions/Transactions";
import Content from "../../components/utils/Content";

class BlockDetail extends React.Component {
  static async getInitialProps({ req, query: { hash } }) {
    try {
      const block = await new BlocksApi(req).getBlockInfo(hash);
      return {
        ...block,
        // the return value should be a serializable object per Next.js documentation, so we map BN to strings
        totalSupply: block.gasPrice.toString(),
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
    const block = {
      hash: this.props.hash,
      height: this.props.height,
      timestamp: this.props.timestamp,
      prevHash: this.props.prevHash,
      transactionsCount: this.props.transactionsCount,
      // `props` should be a serializable object per Next.js documentation, so we map back from strings to BN
      totalSupply: new BN(this.props.totalSupply),
      gasPrice: new BN(this.props.gasPrice),
      gasUsed: new BN(this.props.gasUsed),
      authorAccountId: this.props.authorAccountId,
    };

    return (
      <>
        <Head>
          <title>NEAR Explorer | Block</title>
        </Head>
        <Content
          title={
            <h1>{`Block ${
              block.height
                ? `#${block.height}`
                : `${block.hash.substring(0, 7)}...`
            }`}</h1>
          }
          border={false}
        >
          {this.props.err ? (
            `Information is not available at the moment. Please, check if the block hash is correct or try later.`
          ) : (
            <BlockDetails block={block} />
          )}
        </Content>
        {!this.props.err ? (
          <>
            <Content
              size="medium"
              icon={<TransactionIcon style={{ width: "22px" }} />}
              title={<h2>Transactions</h2>}
            >
              <Transactions blockHash={block.hash} />
            </Content>

            <Content
              size="medium"
              icon={<TransactionIcon style={{ width: "22px" }} />}
              title={<h2>Receipts</h2>}
            >
              <Receipts blockHash={block.hash} />
            </Content>
          </>
        ) : null}
      </>
    );
  }
}

export default BlockDetail;
