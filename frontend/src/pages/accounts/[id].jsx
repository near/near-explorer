import Head from "next/head";

import React from "react";

import AccountsApi from "../../libraries/explorer-wamp/accounts";

import AccountDetails from "../../components/accounts/AccountDetails";
import Transactions from "../../components/transactions/Transactions";
import Content from "../../components/utils/Content";

import TransactionIcon from "../../../public/static/images/icon-t-transactions.svg";

export default class extends React.Component {
  static async getInitialProps({ req, query: { id } }) {
    try {
      return await new AccountsApi(req).getAccountInfo(id);
    } catch (err) {
      return { id, err };
    }
  }

  state = {
    timestamp: "loading",
    address: "loading"
  };

  _getBasic = async () => {
    new AccountsApi()
      .getAccountBasic(this.props.id)
      .then(basic =>
        this.setState({ timestamp: basic.timestamp, address: basic.address })
      )
      .catch(err => {
        this.setState({ timestamp: "", address: "" });
        console.error(err);
      });
  };

  componentDidMount() {
    this._getBasic();
  }

  render() {
    return (
      <>
        <Head>
          <title>Near Explorer | Account</title>
        </Head>
        <Content title={<h1>{`Account: @${this.props.id}`}</h1>} border={false}>
          {this.props.err ? (
            `Information is not available at the moment. Please, check if the account name is correct or try later.`
          ) : (
            <AccountDetails account={{ ...this.props, ...this.state }} />
          )}
        </Content>
        <Content
          size="medium"
          icon={<TransactionIcon style={{ width: "22px" }} />}
          title={<h2>Transactions</h2>}
        >
          {this.props.err ? (
            `Information is not available at the moment. Please, check if the account name is correct or try later.`
          ) : (
            <Transactions accountId={this.props.id} />
          )}
        </Content>
      </>
    );
  }
}
