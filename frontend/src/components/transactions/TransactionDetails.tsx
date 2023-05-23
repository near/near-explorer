import * as React from "react";

import JSBI from "jsbi";
import { useTranslation } from "next-i18next";
import { Row, Col } from "react-bootstrap";

import {
  NestedReceiptWithOutcomeOld,
  TransactionOld,
} from "@/common/types/procedures";
import * as RPC from "@/common/types/rpc";
import TransactionExecutionStatus from "@/frontend/components/transactions/TransactionExecutionStatus";
import AccountLink from "@/frontend/components/utils/AccountLink";
import Balance from "@/frontend/components/utils/Balance";
import BlockLink from "@/frontend/components/utils/BlockLink";
import CardCell, { CardCellText } from "@/frontend/components/utils/CardCell";
import CopyToClipboard from "@/frontend/components/utils/CopyToClipboard";
import Gas from "@/frontend/components/utils/Gas";
import Term from "@/frontend/components/utils/Term";
import { useDateFormat } from "@/frontend/hooks/use-date-format";
import { subscriptions } from "@/frontend/hooks/use-subscription";
import * as BI from "@/frontend/libraries/bigint";
import { styled } from "@/frontend/libraries/styles";

const HeaderRow = styled(Row);

const TransactionInfoContainer = styled("div", {
  border: "solid 4px #e6e6e6",
  borderRadius: 4,

  "& > .row": {
    borderBottom: "2px solid #e6e6e6",
  },

  "& > .row:last-of-type": {
    borderBottom: 0,
  },

  [`& ${HeaderRow} ${CardCellText}`]: {
    fontSize: 24,
  },

  "@media (max-width: 767.98px)": {
    "& .border-sm-0": {
      border: 0,
    },
  },
});

const TransactionCardBlockHash = styled(CardCell, {
  backgroundColor: "#f8f8f8",
});

const TransactionStatusWrapper = styled("div", {
  fontSize: 21,
});

export interface Props {
  transaction: TransactionOld;
}

export interface State {
  deposit?: JSBI;
  gasUsed?: JSBI;
  gasAttached?: JSBI;
  transactionFee?: JSBI;
}

const flattenReceiptOutcomes = (
  receipt: NestedReceiptWithOutcomeOld
): NestedReceiptWithOutcomeOld["outcome"][] =>
  receipt.outcome.nestedReceipts.reduce<
    NestedReceiptWithOutcomeOld["outcome"][]
  >(
    (acc, subReceipt) => [
      ...acc,
      ...("outcome" in subReceipt && subReceipt.outcome.nestedReceipts
        ? flattenReceiptOutcomes(subReceipt)
        : []),
    ],
    [receipt.outcome]
  );

const TransactionDetails: React.FC<Props> = React.memo(({ transaction }) => {
  const { t } = useTranslation();
  const deposit = React.useMemo(
    () =>
      transaction.actions
        .map((action) => {
          if ("deposit" in action.args) {
            return JSBI.BigInt(action.args.deposit);
          }
          return BI.zero;
        })
        .reduce(
          (accumulator, actionDeposit) => JSBI.add(accumulator, actionDeposit),
          BI.zero
        ),
    [transaction.actions]
  );
  const { tokensBurnt, gasUsed } = React.useMemo(() => {
    const outcomes = [
      transaction.outcome,
      ...flattenReceiptOutcomes(transaction.receipt),
    ];
    return {
      gasUsed: outcomes
        .map((outcome) => JSBI.BigInt(outcome.gasBurnt))
        .reduce(
          (gasBurnt, currentFee) => JSBI.add(gasBurnt, currentFee),
          BI.zero
        ),
      tokensBurnt: outcomes
        .map((outcome) => JSBI.BigInt(outcome.tokensBurnt))
        .reduce(
          (tokenBurnt, currentFee) => JSBI.add(tokenBurnt, currentFee),
          BI.zero
        ),
    };
  }, [transaction.outcome, transaction.receipt]);
  const gasAttached = React.useMemo(() => {
    const actionArgs = transaction.actions.map((action) => action.args);
    const gasAttachedArgs = actionArgs.filter(
      (args): args is RPC.FunctionCallActionView["FunctionCall"] =>
        "gas" in args
    );
    if (gasAttachedArgs.length === 0) {
      return gasUsed;
    }
    return gasAttachedArgs.reduce(
      (accumulator, args) =>
        JSBI.add(accumulator, JSBI.BigInt(args.gas.toString())),
      BI.zero
    );
  }, [gasUsed, transaction.actions]);

  const latestBlockSub = subscriptions.latestBlock.useSubscription();
  const format = useDateFormat();
  const isDelegateAction =
    transaction.actions.length === 1 &&
    transaction.actions.every((action) => action.kind === "delegateAction");

  return (
    <TransactionInfoContainer>
      <HeaderRow noGutters>
        <Col md="5">
          <CardCell
            title={
              <Term
                title={t(
                  "component.transactions.TransactionDetails.signed_by.title"
                )}
                text={t(
                  "component.transactions.TransactionDetails.signed_by.text"
                )}
                href="https://docs.near.org/docs/concepts/account"
              />
            }
            imgLink="/static/images/icon-m-user.svg"
            text={<AccountLink accountId={transaction.signerId} />}
            className="border-0"
          />
        </Col>
        <Col md="4">
          <CardCell
            title={
              <Term
                title={t(
                  `component.transactions.TransactionDetails.${
                    isDelegateAction ? "delegator" : "receiver"
                  }.title`
                )}
                text={t(
                  `component.transactions.TransactionDetails.${
                    isDelegateAction ? "delegator" : "receiver"
                  }.text`
                )}
                href="https://docs.near.org/docs/concepts/account"
              />
            }
            imgLink="/static/images/icon-m-user.svg"
            text={<AccountLink accountId={transaction.receiverId} />}
            className="border-sm-0"
          />
        </Col>
        <Col md="3">
          <CardCell
            title={
              <Term
                title={t(
                  "component.transactions.TransactionDetails.status.title"
                )}
                text={t(
                  "component.transactions.TransactionDetails.status.text"
                )}
                href="https://docs.near.org/docs/concepts/transaction"
              />
            }
            imgLink="/static/images/icon-t-status.svg"
            text={
              <TransactionStatusWrapper>
                {transaction.status ? (
                  <TransactionExecutionStatus status={transaction.status} />
                ) : (
                  t("common.blocks.status.fetching_status")
                )}
                {latestBlockSub.status !== "success"
                  ? `/${t("common.blocks.status.checking_finality")}`
                  : transaction.blockTimestamp < latestBlockSub.data.timestamp
                  ? ""
                  : `/${t("common.blocks.status.finalizing")}`}
              </TransactionStatusWrapper>
            }
            className="border-sm-0"
          />
        </Col>
      </HeaderRow>
      <Row noGutters>
        <Col md="3">
          <CardCell
            title={
              <Term
                title={t(
                  "component.transactions.TransactionDetails.transaction_fee.title"
                )}
                text={t(
                  "component.transactions.TransactionDetails.transaction_fee.text"
                )}
                href="https://docs.near.org/docs/concepts/transaction"
              />
            }
            imgLink="/static/images/icon-m-size.svg"
            text={<Balance amount={tokensBurnt.toString()} />}
            className="border-0"
          />
        </Col>
        <Col md="3">
          <CardCell
            title={
              <Term
                title={t(
                  "component.transactions.TransactionDetails.deposit_value.title"
                )}
                text={t(
                  "component.transactions.TransactionDetails.deposit_value.text"
                )}
                href="https://near.org/papers/economics-in-sharded-blockchain/"
              />
            }
            imgLink="/static/images/icon-m-filter.svg"
            text={deposit ? <Balance amount={deposit.toString()} /> : "..."}
            className="border-sm-0"
          />
        </Col>
        <Col md="3">
          <CardCell
            title={
              <Term
                title={t(
                  "component.transactions.TransactionDetails.gas_used.title"
                )}
                text={t(
                  "component.transactions.TransactionDetails.gas_used.text"
                )}
                href="https://docs.near.org/docs/concepts/transaction"
              />
            }
            imgLink="/static/images/icon-m-size.svg"
            text={<Gas gas={gasUsed} />}
            className="border-sm-0"
          />
        </Col>
        <Col md="3">
          <CardCell
            title={
              <Term
                title={t(
                  "component.transactions.TransactionDetails.attached_gas.title"
                )}
                text={t(
                  "component.transactions.TransactionDetails.attached_gas.text"
                )}
              />
            }
            imgLink="/static/images/icon-m-size.svg"
            text={<Gas gas={gasAttached} />}
            className="border-sm-0"
          />
        </Col>
      </Row>
      <Row noGutters className="border-0">
        <Col md="4">
          <CardCell
            title={
              <Term
                title={t(
                  "component.transactions.TransactionDetails.created.title"
                )}
                text={t(
                  "component.transactions.TransactionDetails.created.text"
                )}
                href="https://docs.near.org/docs/concepts/transaction"
              />
            }
            text={
              <>
                {format(
                  transaction.blockTimestamp,
                  t("common.date_time.date_time_format")
                )}
                <CopyToClipboard
                  text={String(transaction.blockTimestamp)}
                  css={{ marginLeft: 8 }}
                />
              </>
            }
            className="border-0"
          />
        </Col>
        <Col md="8">
          <CardCell
            title={
              <Term
                title={t(
                  "component.transactions.TransactionDetails.hash.title"
                )}
                text={t("component.transactions.TransactionDetails.hash.text")}
                href="https://docs.near.org/docs/concepts/transaction"
              />
            }
            text={transaction.hash}
            className="border-0"
          />
        </Col>
      </Row>
      <Row noGutters>
        <Col md="12">
          <TransactionCardBlockHash
            title={
              <Term
                title={t(
                  "component.transactions.TransactionDetails.block_hash.title"
                )}
                text={t(
                  "component.transactions.TransactionDetails.block_hash.text"
                )}
              />
            }
            text={
              <BlockLink blockHash={transaction.blockHash}>
                {transaction.blockHash}
              </BlockLink>
            }
            className="border-0"
          />
        </Col>
      </Row>
    </TransactionInfoContainer>
  );
});

export default TransactionDetails;
