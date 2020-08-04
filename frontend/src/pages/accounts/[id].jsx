import Head from "next/head";

import React from "react";
import { Container } from "react-bootstrap";

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
            <AccountDetails account={{ ...this.props }} />
          )}
        </Content>
        {this.props.err ? (
          `Information is not available at the moment. Please, check if the account name is correct or try later.`
        ) : (
          <Container>
            <ContractDetails accountId={this.props.id} />
          </Container>
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
