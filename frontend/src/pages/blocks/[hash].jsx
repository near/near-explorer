import Head from "next/head";

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
        <Content title={`Block #${this.props.height}`} border={false}>
          <BlockDetails block={this.props} />
        </Content>
        <Content
          size="medium"
          icon={
            <img
              src="/static/images/icon-t-transactions.svg"
              style={{ width: "22px", marginTop: "5px" }}
            />
          }
          title={`Transactions`}
        >
          <Transactions blockHash={this.props.hash} />
        </Content>
      </>
    );
  }
}
