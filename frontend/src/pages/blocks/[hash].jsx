import Head from "next/head";

import React from "react";

import TransactionIcon from "../../../public/static/images/icon-t-transactions.svg";

import * as BlockApi from "../../libraries/explorer-wamp/blocks";

import BlockDetails from "../../components/blocks/BlockDetails";
import Transactions from "../../components/transactions/Transactions";
import Content from "../../components/utils/Content";

export default class extends React.Component {
  static async getInitialProps({ query: { hash } }) {
    try {
      return await BlockApi.getBlockInfo(hash);
    } catch (err) {
      return {};
    }
  }

  render() {
    return (
      <>
        <Head>
          <title>Near Explorer | Block</title>
        </Head>
        <Content
          title={<h1>{`Block #${this.props.height}`}</h1>}
          border={false}
        >
          <BlockDetails block={this.props} />
        </Content>
        <Content
          size="medium"
          icon={<TransactionIcon style={{ width: "22px" }} />}
          title={<h2>Transactions</h2>}
        >
          <Transactions blockHash={this.props.hash} />
        </Content>
      </>
    );
  }
}
