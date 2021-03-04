import Head from "next/head";

import React from "react";

import TransactionIcon from "../../../public/static/images/icon-t-transactions.svg";

import TransactionsApi from "../../libraries/explorer-wamp/transactions";

import ActionsList from "../../components/transactions/ActionsList";
import ReceiptsList from "../../components/transactions/ReceiptsList";
import ReceiptsOutcomeList from "../..//components/transactions/ReceiptsOutcomeList";
import TransactionDetails from "../../components/transactions/TransactionDetails";
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
    const { hash } = this.props;

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
        {/* {this.props.receiptsOutcome && (
          <Content
            size="medium"
            icon={<TransactionIcon style={{ width: "22px" }} />}
            title={<h2>Receipts</h2>}
          >
            <ReceiptsList receipts={this.props.receiptsOutcome} />
          </Content>
        )} */}

        {this.props.receiptsList && (
          <Content
            size="medium"
            icon={<TransactionIcon style={{ width: "22px" }} />}
            title={<h2>Receipts</h2>}
          >
            <ReceiptsOutcomeList receipts={this.props.receiptsList} />
          </Content>
        )}
      </>
    );
  }
}

export default TransactionDetailsPage;
