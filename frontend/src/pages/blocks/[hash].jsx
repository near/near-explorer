import Head from "next/head";

import React from "react";

import { Mixpanel } from "../../../mixpanel/index";

import TransactionIcon from "../../../public/static/images/icon-t-transactions.svg";

import BlocksApi from "../../libraries/explorer-wamp/blocks";

import BlockDetails from "../../components/blocks/BlockDetails";
import Transactions from "../../components/transactions/Transactions";
import Content from "../../components/utils/Content";

export default class extends React.Component {
  static async getInitialProps({ req, query: { hash } }) {
    try {
      return await new BlocksApi(req).getBlockInfo(hash);
    } catch (err) {
      return { hash, err };
    }
  }

  render() {
    Mixpanel.track("View Individual Block", { block: this.props.hash });
    return (
      <>
        <Head>
          <title>NEAR Explorer | Block</title>
        </Head>
        <Content
          title={
            <h1>{`Block ${
              this.props.height
                ? `#${this.props.height}`
                : `${this.props.hash.substring(0, 7)}...`
            }`}</h1>
          }
          border={false}
        >
          {this.props.err ? (
            `Information is not available at the moment. Please, check if the block hash is correct or try later.`
          ) : (
            <BlockDetails block={this.props} />
          )}
        </Content>
        {!this.props.err ? (
          <Content
            size="medium"
            icon={<TransactionIcon style={{ width: "22px" }} />}
            title={<h2>Transactions</h2>}
          >
            <Transactions blockHash={this.props.hash} />
          </Content>
        ) : null}
      </>
    );
  }
}
