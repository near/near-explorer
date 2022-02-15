import BN from "bn.js";
import moment from "../../libraries/moment";

import { Row, Col } from "react-bootstrap";
import { FC, useEffect, useMemo } from "react";

import AccountLink from "../utils/AccountLink";
import BlockLink from "../utils/BlockLink";
import CardCell, { CardCellText } from "../utils/CardCell";
import Balance from "../utils/Balance";
import Gas from "../utils/Gas";
import Term from "../utils/Term";
import TransactionExecutionStatus from "./TransactionExecutionStatus";

import { useTranslation } from "react-i18next";
import { useFinalBlockTimestampNanosecond } from "../../hooks/data";
import { Transaction } from "../../pages/transactions/[hash]";
import { FunctionCall } from "../../libraries/wamp/types";
import { styled } from "../../libraries/styles";

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
  transaction: Transaction;
}

export interface State {
  deposit?: BN;
  gasUsed?: BN;
  gasAttached?: BN;
  transactionFee?: BN;
}

const TransactionDetails: FC<Props> = ({ transaction }) => {
  const { t } = useTranslation();
  const deposit = useMemo(() => {
    return transaction.actions
      .map((action) => {
        if ("deposit" in action.args) {
          return new BN(action.args.deposit);
        } else {
          return new BN(0);
        }
      })
      .reduce((accumulator, deposit) => accumulator.add(deposit), new BN(0));
  }, [transaction.actions]);
  const gasUsed = useMemo(() => {
    const gasBurntByTx = transaction.transactionOutcome
      ? new BN(transaction.transactionOutcome.outcome.gas_burnt)
      : new BN(0);
    const gasBurntByReceipts = transaction.receiptsOutcome
      ? transaction.receiptsOutcome
          .map((receipt) => new BN(receipt.outcome.gas_burnt))
          .reduce((gasBurnt, currentFee) => gasBurnt.add(currentFee), new BN(0))
      : new BN(0);
    return gasBurntByTx.add(gasBurntByReceipts);
  }, [transaction.transactionOutcome, transaction.receiptsOutcome]);
  const transactionFee = useMemo(() => {
    const tokensBurntByTx = transaction.transactionOutcome
      ? new BN(transaction.transactionOutcome.outcome.tokens_burnt)
      : new BN(0);
    const tokensBurntByReceipts = transaction.receiptsOutcome
      ? transaction.receiptsOutcome
          .map((receipt) => new BN(receipt.outcome.tokens_burnt))
          .reduce(
            (tokenBurnt, currentFee) => tokenBurnt.add(currentFee),
            new BN(0)
          )
      : new BN(0);
    return tokensBurntByTx.add(tokensBurntByReceipts);
  }, [transaction.transactionOutcome, transaction.receiptsOutcome]);
  const gasAttached = useMemo(() => {
    const actionArgs = transaction.actions.map((action) => action.args);
    const gasAttachedArgs = actionArgs.filter(
      (args): args is FunctionCall => "gas" in args
    );
    if (gasAttachedArgs.length === 0) {
      return gasUsed;
    }
    return gasAttachedArgs.reduce(
      (accumulator, args) => accumulator.add(new BN(args.gas.toString())),
      new BN(0)
    );
  }, [transaction.actions]);
  useEffect(() => {}, [transaction.blockHash]);

  const finalBlockTimestampNanosecond = useFinalBlockTimestampNanosecond();

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
                href={"https://docs.near.org/docs/concepts/account"}
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
                  "component.transactions.TransactionDetails.receiver.title"
                )}
                text={t(
                  "component.transactions.TransactionDetails.receiver.text"
                )}
                href={"https://docs.near.org/docs/concepts/account"}
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
                href={"https://docs.near.org/docs/concepts/transaction"}
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
                {!finalBlockTimestampNanosecond
                  ? "/" + t("common.blocks.status.checking_finality")
                  : new BN(transaction.blockTimestamp).lte(
                      finalBlockTimestampNanosecond.divn(10 ** 6)
                    )
                  ? ""
                  : "/" + t("common.blocks.status.finalizing")}
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
                href={"https://docs.near.org/docs/concepts/transaction"}
              />
            }
            imgLink="/static/images/icon-m-size.svg"
            text={
              transactionFee ? (
                <Balance amount={transactionFee.toString()} />
              ) : (
                "..."
              )
            }
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
                href={
                  "https://near.org/papers/economics-in-sharded-blockchain/"
                }
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
                href={"https://docs.near.org/docs/concepts/transaction"}
              />
            }
            imgLink="/static/images/icon-m-size.svg"
            text={gasUsed ? <Gas gas={gasUsed} /> : "..."}
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
            text={gasAttached ? <Gas gas={gasAttached} /> : "..."}
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
                href={"https://docs.near.org/docs/concepts/transaction"}
              />
            }
            text={moment(transaction.blockTimestamp).format(
              t("common.date_time.date_time_format")
            )}
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
                href={"https://docs.near.org/docs/concepts/transaction"}
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
};

export default TransactionDetails;
