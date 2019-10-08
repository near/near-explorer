import Head from "next/head";

import * as AccountApi from "../../libraries/explorer-wamp/accounts";

import AccountDetails from "../../components/accounts/AccountDetails";
import Transactions from "../../components/transactions/Transactions";
import Content from "../../components/utils/Content";

export default class extends React.Component {
  static async getInitialProps({ query: { id } }) {
    try {
      return await AccountApi.getAccountInfo(id);
    } catch (err) {
      return { id, err };
    }
  }

  render() {
    return (
      <>
        <Head>
          <title>Near Explorer | Account</title>
        </Head>
        <Content
          title={`Account: @${this.props.id}`}
          border={false}
          style={{ paddingBottom: "1em" }}
        >
          {this.props.err ? (
            `Information is not available at the moment. Please, check if the account name is correct or try later.`
          ) : (
            <AccountDetails account={this.props} />
          )}
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
          <Transactions account={this.props.id} />
        </Content>
      </>
    );
  }
}
