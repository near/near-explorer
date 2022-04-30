import Head from "next/head";

import TransactionIconSvg from "../../../public/static/images/icon-t-transactions.svg";

import ActionsList from "../../components/transactions/ActionsList";
import ReceiptRow from "../../components/transactions/ReceiptRow";
import TransactionDetails from "../../components/transactions/TransactionDetails";
import TransactionOutcome from "../../components/transactions/TransactionOutcome";
import Content from "../../components/utils/Content";

import { useTranslation } from "react-i18next";
import { GetServerSideProps, NextPage } from "next";
import { useAnalyticsTrackOnMount } from "../../hooks/analytics/use-analytics-track-on-mount";
import { Action, TransactionBaseInfo } from "../../types/procedures";
import * as RPC from "../../types/rpc";
import { KeysOfUnion } from "../../types/util";
import { getFetcher } from "../../libraries/transport";
import { getNearNetwork } from "../../libraries/config";
import { styled } from "../../libraries/styles";
import * as React from "react";

const TransactionIcon = styled(TransactionIconSvg, {
  width: 22,
});

type Props = {
  hash: string;
  transaction?: Transaction;
  err?: unknown;
};

const TransactionDetailsPage: NextPage<Props> = React.memo((props) => {
  const { t } = useTranslation();
  useAnalyticsTrackOnMount("Explorer View Individual Transaction Page", {
    transaction_hash: props.hash,
  });

  const transaction = props.transaction;

  return (
    <>
      <Head>
        <title>NEAR Explorer | Transaction</title>
      </Head>
      <Content
        title={
          <h1>
            {t("common.transactions.transaction")}
            {`: ${props.hash.substring(0, 7)}...${props.hash.substring(
              props.hash.length - 4
            )}`}
          </h1>
        }
        border={false}
      >
        {!transaction ? (
          t("page.transactions.error.transaction_fetching")
        ) : (
          <TransactionDetails transaction={transaction} />
        )}
      </Content>
      {transaction && (
        <Content
          icon={<TransactionIcon />}
          title={<h2>{t("common.actions.actions")}</h2>}
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
          icon={<TransactionIcon />}
          title={<h2>{t("page.transactions.transaction_execution_plan")}</h2>}
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
});

export type TransactionOutcome = {
  id: string;
  outcome: RPC.ExecutionOutcomeView;
  block_hash: string;
};

type ReceiptExecutionOutcome = {
  tokens_burnt: string;
  logs: string[];
  outgoing_receipts?: NestedReceiptWithOutcome[];
  status: RPC.ExecutionStatusView;
  gas_burnt: number;
};

export type NestedReceiptWithOutcome = {
  actions?: Action[];
  block_hash: string;
  outcome: ReceiptExecutionOutcome;
  predecessor_id: string;
  receipt_id: string;
  receiver_id: string;
};

export type Transaction = TransactionBaseInfo & {
  status: KeysOfUnion<RPC.FinalExecutionStatus>;
  receiptsOutcome: RPC.ExecutionOutcomeWithIdView[];
  transactionOutcome: TransactionOutcome;
  receipt: NestedReceiptWithOutcome;
};

const mapRpcActionToAction = (action: RPC.ActionView): Action => {
  if (action === "CreateAccount") {
    return {
      kind: "CreateAccount",
      args: {},
    };
  }
  const kind = Object.keys(action)[0] as keyof Exclude<
    RPC.ActionView,
    "CreateAccount"
  >;
  return {
    kind,
    args: action[kind],
  } as Action;
};

export const getServerSideProps: GetServerSideProps<
  Props,
  { hash: string }
> = async ({ req, params, query }) => {
  const hash = params?.hash ?? "";
  try {
    const nearNetwork = getNearNetwork(query, req.headers.host);
    const fetcher = getFetcher(nearNetwork);
    const transactionBaseInfo = await fetcher("transaction-info", [hash]);
    if (!transactionBaseInfo) {
      throw new Error(`No hash ${hash} found`);
    }
    const transactionInfo = await fetcher("nearcore-tx", [
      transactionBaseInfo.hash,
      transactionBaseInfo.signerId,
    ]);
    const actions = transactionInfo.transaction.actions.map(
      mapRpcActionToAction
    );
    const receipts = transactionInfo.receipts;
    const receiptsOutcome = transactionInfo.receipts_outcome;
    if (
      receipts.length === 0 ||
      receipts[0].receipt_id !== receiptsOutcome[0].id
    ) {
      receipts.unshift({
        predecessor_id: transactionInfo.transaction.signer_id,
        receipt: {
          Action: {
            signer_id: transactionInfo.transaction.signer_id,
            signer_public_key: "",
            gas_price: "0",
            output_data_receivers: [],
            input_data_ids: [],
            actions: transactionInfo.transaction.actions,
          },
        },
        receipt_id: receiptsOutcome[0].id,
        receiver_id: transactionInfo.transaction.receiver_id,
      });
    }
    const receiptOutcomesByIdMap = new Map<
      string,
      RPC.ExecutionOutcomeWithIdView
    >();
    receiptsOutcome.forEach((receipt) => {
      receiptOutcomesByIdMap.set(receipt.id, receipt);
    });

    const receiptsByIdMap = new Map<
      string,
      Omit<RPC.ReceiptView, "actions"> & { actions: Action[] }
    >();
    receipts.forEach((receiptItem) => {
      receiptsByIdMap.set(receiptItem.receipt_id, {
        ...receiptItem,
        actions:
          "Action" in receiptItem.receipt
            ? receiptItem.receipt.Action.actions.map(mapRpcActionToAction)
            : [],
      });
    });

    const collectNestedReceiptWithOutcome = (
      receiptHash: string
    ): NestedReceiptWithOutcome => {
      const receipt = receiptsByIdMap.get(receiptHash)!;
      const receiptOutcome = receiptOutcomesByIdMap.get(receiptHash)!;
      return {
        ...receipt,
        ...receiptOutcome,
        outcome: {
          ...receiptOutcome.outcome,
          outgoing_receipts: receiptOutcome.outcome.receipt_ids.map(
            collectNestedReceiptWithOutcome
          ),
        },
      };
    };
    return {
      props: {
        hash,
        transaction: {
          ...transactionBaseInfo,
          status: Object.keys(
            transactionInfo.status
          )[0] as KeysOfUnion<RPC.FinalExecutionStatus>,
          actions,
          receiptsOutcome,
          receipt: collectNestedReceiptWithOutcome(receiptsOutcome[0].id),
          transactionOutcome: transactionInfo.transaction_outcome,
        },
      },
    };
  } catch (err) {
    return {
      props: { hash, err: String(err) },
    };
  }
};

export default TransactionDetailsPage;
