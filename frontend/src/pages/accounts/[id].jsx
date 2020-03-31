import Head from "next/head";

import React from "react";

import AccountsApi from "../../libraries/explorer-wamp/accounts";

import AccountDetails from "../../components/accounts/AccountDetails";
import ContractDetails from "../../components/contracts/ContractDetails";
import Transactions from "../../components/transactions/Transactions";
import Content from "../../components/utils/Content";

import TransactionIcon from "../../../public/static/images/icon-t-transactions.svg";

export default class extends React.Component {
  static async getInitialProps({ req, query: { id } }) {
    try {
      const account = await new AccountsApi(req).getAccountInfo(id);
      account.id = id;
      return account;
    } catch (err) {
      return { id, err };
    }
  }

  state = {
    createdAtBlockTimestamp: null,
    createdByTransactionHash: null
  };

  _updateBasicAccountInfo = () => {
    return new AccountsApi()
      .getAccountBasic(this.props.id)
      .then(basic => {
        if(basic){
          this.setState({
            createdAtBlockTimestamp: basic.createdAtBlockTimestamp,
            createdByTransactionHash: basic.createdByTransactionHash
          });
        }
        return;
      })
      .catch(err => {
        this.setState({
          createdAtBlockTimestamp: null,
          createdByTransactionHash: null
        });
        console.error(err);
      });
  };

  componentDidMount() {
    this._updateBasicAccountInfo();
  }

  componentDidUpdate(prevProps) {
    if (this.props.id != prevProps.id) {
      this._updateBasicAccountInfo();
    }
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
        {this.props.err ? (
          `Information is not available at the moment. Please, check if the account name is correct or try later.`
        ) : (
          <ContractDetails accountId={this.props.id} />
        )}
        <Content
          size="medium"
          icon={<TransactionIcon style={{ width: "22px" }} />}
          title={<h2>Transactions</h2>}
        >
          {this.props.err ? (
            `Information is not available at the moment. Please, check if the account name is correct or try later.`
          ) : (
            <Transactions accountId={this.props.id} count={5} />
          )}
        </Content>
      </>
    );
  }
}
