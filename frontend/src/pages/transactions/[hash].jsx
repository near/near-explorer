import Head from "next/head";

import { Component } from "react";

import Mixpanel from "../../libraries/mixpanel";

import TransactionIcon from "../../../public/static/images/icon-t-transactions.svg";

import TransactionsApi from "../../libraries/explorer-wamp/transactions";

import ActionsList from "../../components/transactions/ActionsList";
import ReceiptRow from "../../components/transactions/ReceiptRow";
import TransactionDetails from "../../components/transactions/TransactionDetails";
import TransactionOutcome from "../../components/transactions/TransactionOutcome";
import Content from "../../components/utils/Content";

import { Translate } from "react-localize-redux";

class TransactionDetailsPage extends Component {
  static async getInitialProps({ req, query: { hash } }) {
    try {
      return await new TransactionsApi(req).getTransactionInfo(hash);
    } catch (err) {
      return { hash, err };
    }
  }

  componentDidMount() {
    Mixpanel.track("Explorer View Individual Transaction Page", {
      transaction_hash: this.props.hash,
    });
  }

  render() {
    // Prepare the transaction object with all the right types and field names on render() since
    // `getInitialProps` can only return basic types to be serializable after Server-side Rendering
    const transaction = {
      actions: this.props.actions,
      blockTimestamp: this.props.blockTimestamp,
      blockHash: this.props.blockHash,
      hash: this.props.hash,
      receipt: this.props.receipt,
      transactionOutcome: this.props.transactionOutcome,
      receiptsOutcome: this.props.receiptsOutcome,
      signerId: this.props.signerId,
      receiverId: this.props.receiverId,
      status: this.props.status,
    };

    return (
      <Translate>
        {({ translate }) => (
          <>
            <Head>
              <title>NEAR Explorer | Transaction</title>
            </Head>
            <Content
              title={
                <h1>
                  <Translate id="common.transactions.transaction" />
                  {`: ${transaction.hash.substring(
                    0,
                    7
                  )}...${transaction.hash.substring(
                    transaction.hash.length - 4
                  )}`}
                </h1>
              }
              border={false}
            >
              {this.props.err ? (
                `Information is not available at the moment. Please, check if the transaction hash is correct or try later.`
              ) : (
                <TransactionDetails transaction={transaction} />
              )}
            </Content>
            {transaction.actions && (
              <Content
                size="medium"
                icon={<TransactionIcon style={{ width: "22px" }} />}
                title={
                  <h2>
                    <Translate id="common.actions.actions" />
                  </h2>
                }
              >
                <ActionsList
                  actions={transaction.actions}
                  signerId={transaction.signerId}
                  receiverId={transaction.receiverId}
                  blockTimestamp={transaction.blockTimestamp}
                  detalizationMode="minimal"
                  showDetails
                />
              </Content>
            )}

            {transaction.receipt && (
              <Content
                size="medium"
                icon={<TransactionIcon style={{ width: "22px" }} />}
                title={
                  <h2>
                    <Translate id="page.transactions.transaction_execution_plan" />
                  </h2>
                }
              >
                <TransactionOutcome
                  transaction={transaction.transactionOutcome}
                />

                <ReceiptRow receipt={transaction.receipt} />
              </Content>
            )}
          </>
        )}
      </Translate>
    );
  }
}

export default TransactionDetailsPage;
