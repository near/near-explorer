import Head from "next/head";

import React from "react";

import TransactionIcon from "../../../public/static/images/icon-t-transactions.svg";

import TransactionsApi from "../../libraries/explorer-wamp/transactions";

import ActionsList from "../../components/transactions/ActionsList";
import ReceiptsList from "../../components/transactions/ReceiptsList";
import TransactionDetails from "../../components/transactions/TransactionDetails";
import TransactionOutcome from "../../components/transactions/TransactionOutcome";
import Content from "../../components/utils/Content";

class TransactionDetailsPage extends React.Component {
  static async getInitialProps({ req, query: { hash } }) {
    try {
      return await new TransactionsApi(req).getTransactionInfo(hash);
    } catch (err) {
      return { hash, err };
    }
  }

  render() {
    const { hash, receiptsOutcome } = this.props;

    console.log("TransactionDetailsPage", this.props);

    return (
      <>
        <Head>
          <title>NEAR Explorer | Transaction</title>
        </Head>
        <Content
          title={
            <h1>{`Transaction: ${hash.substring(0, 7)}...${hash.substring(
              hash.length - 4
            )}`}</h1>
          }
          border={false}
        >
          {this.props.err ? (
            `Information is not available at the moment. Please, check if the transaction hash is correct or try later.`
          ) : (
            <TransactionDetails transaction={this.props} />
          )}
        </Content>
        {this.props.actions && (
          <Content
            size="medium"
            icon={<TransactionIcon style={{ width: "22px" }} />}
            title={<h2>Actions</h2>}
          >
            <ActionsList
              actions={this.props.actions}
              transaction={this.props}
              detalizationMode="minimal"
              showDetails
            />
          </Content>
        )}

        {receiptsOutcome && (
          <Content
            size="medium"
            icon={<TransactionIcon style={{ width: "22px" }} />}
            title={<h2>Transaction Execution Plan</h2>}
          >
            <TransactionOutcome transaction={this.props.transactionOutcome} />

            <ReceiptsList
              receipts={this.props.receipts}
              convertedReceiptHash={receiptsOutcome[0].id}
            />
          </Content>
        )}
      </>
    );
  }
}

export default TransactionDetailsPage;
