import BN from "bn.js";

import { FC } from "react";

import { Row, Col } from "react-bootstrap";

import Gas from "../utils/Gas";
import Balance from "../utils/Balance";
import AccountLink from "../utils/AccountLink";
import BlockLink from "../utils/BlockLink";
import ReceiptLink from "../utils/ReceiptLink";
import { displayArgs } from "./ActionMessage";
import ActionRow from "./ActionRow";

import { useTranslation } from "react-i18next";
import { NestedReceiptWithOutcome } from "../../pages/transactions/[hash]";
import {
  RpcReceiptFailure,
  RpcReceiptSuccessId,
  RpcReceiptSuccessValue,
} from "../../libraries/wamp/types";

export interface Props {
  receipt: NestedReceiptWithOutcome;
  transactionHash: string;
}

const ReceiptRow: FC<Props> = ({ receipt, transactionHash }) => {
  const { t } = useTranslation();
  let statusInfo;
  if ("SuccessValue" in (receipt.outcome.status as RpcReceiptSuccessValue)) {
    const { SuccessValue } = receipt.outcome.status as RpcReceiptSuccessValue;
    if (SuccessValue === null) {
      statusInfo = t("component.transactions.ReceiptRow.no_result");
    } else if (SuccessValue.length === 0) {
      statusInfo = t("component.transactions.ReceiptRow.empty_result");
    } else {
      statusInfo = (
        <>
          <i>{t("component.transactions.ReceiptRow.result")}: </i>
          {displayArgs(SuccessValue, t)}
        </>
      );
    }
  } else if ("Failure" in (receipt.outcome.status as RpcReceiptFailure)) {
    const { Failure } = receipt.outcome.status as RpcReceiptFailure;
    statusInfo = (
      <>
        <i>{t("component.transactions.ReceiptRow.failure")}: </i>
        <pre>{JSON.stringify(Failure, null, 2)}</pre>
      </>
    );
  } else if (
    "SuccessReceiptId" in (receipt.outcome.status as RpcReceiptSuccessId)
  ) {
    const { SuccessReceiptId } = receipt.outcome.status as RpcReceiptSuccessId;
    statusInfo = (
      <>
        <i>{t("component.transactions.ReceiptRow.success_receipt_id")}: </i>
        <pre>{SuccessReceiptId}</pre>
      </>
    );
  }

  let gasBurnedByReceipt = new BN(0);
  let tokensBurnedByReceipt = new BN(0);
  if (receipt && receipt.outcome) {
    gasBurnedByReceipt = new BN(receipt.outcome.gas_burnt);
    tokensBurnedByReceipt = new BN(receipt.outcome.tokens_burnt);
  }
  return (
    <Row
      noGutters
      className="receipt-row"
      key={receipt.receipt_id}
      id={receipt.receipt_id}
    >
      <Col>
        <Row noGutters>
          <Col className="receipt-row-title receipt-hash-title">
            <b>{t("common.receipts.receipt")}:</b>
          </Col>
        </Row>

        <Row noGutters className="receipt-row-section">
          <Col className="receipt-row-title">
            {t("common.receipts.receipt_id")}:
          </Col>
          <Col className="receipt-row-receipt-hash truncate-link">
            <ReceiptLink
              transactionHash={transactionHash}
              receiptId={receipt.receipt_id}
              truncate={false}
            />
          </Col>
        </Row>

        <Row noGutters className="receipt-row-section">
          <Col className="receipt-row-title">
            {t("common.receipts.executed_in_block")}:
          </Col>
          <Col className="receipt-row-receipt-hash truncate-link">
            <BlockLink blockHash={receipt.block_hash} truncate={false} />
          </Col>
        </Row>

        <Row noGutters className="receipt-row-section">
          <Col className="receipt-row-title">
            {t("common.receipts.predecessor_id")}:
          </Col>
          <Col
            className="receipt-row-receipt-hash"
            title={receipt.predecessor_id}
          >
            <AccountLink accountId={receipt.predecessor_id} />
          </Col>
        </Row>

        <Row noGutters className="receipt-row-section">
          <Col className="receipt-row-title">
            {t("common.receipts.receiver_id")}:
          </Col>
          <Col className="receipt-row-receipt-hash" title={receipt.receiver_id}>
            <AccountLink accountId={receipt.receiver_id} />
          </Col>
        </Row>

        <Row noGutters className="receipt-row-section">
          <Col className="receipt-row-title">
            {t("common.transactions.execution.gas_burned")}:
          </Col>
          <Col className="receipt-row-receipt-hash">
            {gasBurnedByReceipt ? <Gas gas={gasBurnedByReceipt} /> : "..."}
          </Col>
        </Row>

        <Row noGutters className="receipt-row-section">
          <Col className="receipt-row-title">
            {t("common.transactions.execution.tokens_burned")}:
          </Col>
          <Col className="receipt-row-receipt-hash">
            {tokensBurnedByReceipt ? (
              <Balance amount={tokensBurnedByReceipt.toString()} />
            ) : (
              "..."
            )}
          </Col>
        </Row>

        <Row noGutters className="receipt-row-section">
          <Col className="receipt-row-text">
            {receipt.actions && receipt.actions.length > 0
              ? receipt.actions.map((action, index) => (
                  <ActionRow
                    key={receipt.receipt_id + index}
                    action={action}
                    receiverId={receipt.receiver_id}
                    signerId={receipt.predecessor_id}
                    detalizationMode="minimal"
                    showDetails
                  />
                ))
              : t("component.transactions.ReceiptRow.no_actions")}
          </Col>
        </Row>

        <Row noGutters className="receipt-row-section">
          <Col className="receipt-row-status">{statusInfo}</Col>
        </Row>

        <Row noGutters className="receipt-row-section">
          <Col className="receipt-row-text">
            {receipt.outcome.logs.length === 0 ? (
              t("component.transactions.ReceiptRow.no_logs")
            ) : (
              <pre>{receipt.outcome.logs.join("\n")}</pre>
            )}
          </Col>
        </Row>

        {receipt.outcome.outgoing_receipts &&
          receipt.outcome.outgoing_receipts.length > 0 &&
          receipt.outcome.outgoing_receipts.map((executedReceipt) => (
            <Row
              noGutters
              className="executed-receipt-row"
              key={executedReceipt.receipt_id}
            >
              <Col>
                <ReceiptRow
                  transactionHash={transactionHash}
                  receipt={executedReceipt}
                />
              </Col>
            </Row>
          ))}
      </Col>
      <style jsx global>{`
        .receipt-row {
          padding-top: 10px;
          padding-bottom: 30px;
        }

        .receipt-row-section {
          padding-top: 10px;
          padding-left: 1.5rem;
          border-left: 2px solid #e5e5e5;
        }

        .executed-receipt-row .receipt-row {
          padding-left: 1.5rem;
          padding-bottom: 0;
          border-left: 2px solid #e5e5e5;
        }

        .receipt-hash-title {
          padding-bottom: 10px;
        }

        .receipt-row-title {
          font-size: 14px;
          line-height: 1.29;
          color: #24272a;
        }

        .receipt-row-text {
          font-size: 12px;
          line-height: 1.5;
          color: #999999;
        }

        .receipt-row-receipt-hash {
          font-size: 14px;
          font-weight: 500;
          line-height: 1.29;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .receipt-row-receipt-hash.truncate-link {
          color: #007bff;
        }

        .receipt-row-status {
          font-size: 12px;
          color: #999999;
          font-weight: 500;
        }
      `}</style>
    </Row>
  );
};

export default ReceiptRow;
