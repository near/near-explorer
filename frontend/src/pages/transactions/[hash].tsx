import Head from "next/head";

import { useEffect } from "react";

import Mixpanel from "../../libraries/mixpanel";

import TransactionIcon from "../../../public/static/images/icon-t-transactions.svg";

import TransactionsApi, {
  Transaction,
} from "../../libraries/explorer-wamp/transactions";

import ActionsList from "../../components/transactions/ActionsList";
import ReceiptRow from "../../components/transactions/ReceiptRow";
import TransactionDetails from "../../components/transactions/TransactionDetails";
import TransactionOutcome from "../../components/transactions/TransactionOutcome";
import Content from "../../components/utils/Content";

import { Translate } from "react-localize-redux";
import { NextPage } from "next";

type SuccessfulProps = Transaction | null;

type FailedProps = {
  hash: string;
  err: unknown;
};

type Props = SuccessfulProps | FailedProps;

const TransactionDetailsPage: NextPage<Props> = (props) => {
  useEffect(() => {
    Mixpanel.track("Explorer View Individual Transaction Page", {
      transaction_hash: props.hash,
    });
  }, []);

  // Prepare the transaction object with all the right types and field names on render() since
  // `getInitialProps` can only return basic types to be serializable after Server-side Rendering
  const transaction = "err" in props ? undefined : props;

  return (
    <>
      <Head>
        <title>NEAR Explorer | Transaction</title>
      </Head>
      <Content
        title={
          <h1>
            <Translate id="common.transactions.transaction" />
            {`: ${props.hash.substring(0, 7)}...${props.hash.substring(
              props.hash.length - 4
            )}`}
          </h1>
        }
        border={false}
      >
        {!transaction ? (
          <Translate id="page.transactions.error.transaction_fetching" />
        ) : (
          <TransactionDetails transaction={transaction} />
        )}
      </Content>
      {transaction && (
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

      {transaction?.receipt && (
        <Content
          size="medium"
          icon={<TransactionIcon style={{ width: "22px" }} />}
          title={
            <h2>
              <Translate id="page.transactions.transaction_execution_plan" />
            </h2>
          }
        >
          {transaction.transactionOutcome && (
            <TransactionOutcome transaction={transaction.transactionOutcome} />
          )}

          <ReceiptRow
            receipt={transaction.receipt}
            transactionHash={transaction.hash}
          />
        </Content>
      )}
    </>
  );
};

TransactionDetailsPage.getInitialProps = async ({
  req,
  query: { hash: rawHash },
}) => {
  const hash = rawHash as string;
  try {
    return await new TransactionsApi(req).getTransactionInfo(hash);
  } catch (err) {
    return { hash, err };
  }
};

export default TransactionDetailsPage;
