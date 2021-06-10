import BN from "bn.js";

import React from "react";

import { Row, Col } from "react-bootstrap";

import * as T from "../../libraries/explorer-wamp/transactions";

import Gas from "../utils/Gas";
import Balance from "../utils/Balance";
import BlockLink from "../utils/BlockLink";
import { truncateAccountId } from "../../libraries/formatting";
import { displayArgs } from "./ActionMessage";
import ActionRow from "./ActionRow";

export interface Props {
  receipt: T.NestedReceiptWithOutcome;
}

class ReceiptRow extends React.Component<Props> {
  render() {
    const { receipt } = this.props;

    let statusInfo;
    if ("SuccessValue" in (receipt.outcome.status as T.ReceiptSuccessValue)) {
      const { SuccessValue } = receipt.outcome.status as T.ReceiptSuccessValue;
      if (SuccessValue === null) {
        statusInfo = "No result";
      } else if (SuccessValue.length === 0) {
        statusInfo = "Empty result";
      } else {
        statusInfo = (
          <>
            <i>Result: </i>
            {displayArgs(SuccessValue)}
          </>
        );
      }
    } else if ("Failure" in (receipt.outcome.status as T.ReceiptFailure)) {
      const { Failure } = receipt.outcome.status as T.ReceiptFailure;
      statusInfo = (
        <>
          <i>Failure: </i>
          <pre>{JSON.stringify(Failure, null, 2)}</pre>
        </>
      );
    } else if (
      "SuccessReceiptId" in (receipt.outcome.status as T.ReceiptSuccessId)
    ) {
      const { SuccessReceiptId } = receipt.outcome.status as T.ReceiptSuccessId;
      statusInfo = (
        <>
          <i>SuccessReceiptId: </i>
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
              <b>Receipt:</b>
            </Col>
          </Row>

          <Row noGutters className="receipt-row-section">
            <Col className="receipt-row-title">Receipt ID:</Col>
            <Col className="receipt-row-receipt-hash">{receipt.receipt_id}</Col>
          </Row>

          <Row noGutters className="receipt-row-section">
            <Col className="receipt-row-title">Executed in Block:</Col>
            <Col className="receipt-row-receipt-hash">
              <BlockLink blockHash={receipt.block_hash} />
            </Col>
          </Row>

          <Row noGutters className="receipt-row-section">
            <Col className="receipt-row-title">Predecessor ID:</Col>
            <Col
              className="receipt-row-receipt-hash"
              title={receipt.predecessor_id}
            >
              {truncateAccountId(receipt.predecessor_id)}
            </Col>
          </Row>

          <Row noGutters className="receipt-row-section">
            <Col className="receipt-row-title">Receiver ID:</Col>
            <Col
              className="receipt-row-receipt-hash"
              title={receipt.receiver_id}
            >
              {truncateAccountId(receipt.receiver_id)}
            </Col>
          </Row>

          <Row noGutters className="receipt-row-section">
            <Col className="receipt-row-title">Gas Burned:</Col>
            <Col className="receipt-row-receipt-hash">
              {gasBurnedByReceipt ? <Gas gas={gasBurnedByReceipt} /> : "..."}
            </Col>
          </Row>

          <Row noGutters className="receipt-row-section">
            <Col className="receipt-row-title">Tokens Burned:</Col>
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
                ? receipt.actions.map((action: T.Action, index: number) => (
                    <ActionRow
                      key={receipt.receipt_id + index}
                      action={action}
                      receiverId={receipt.receiver_id}
                      signerId={receipt.predecessor_id}
                      detalizationMode="minimal"
                      showDetails
                    />
                  ))
                : "No actions"}
            </Col>
          </Row>

          <Row noGutters className="receipt-row-section">
            <Col className="receipt-row-status">{statusInfo}</Col>
          </Row>

          <Row noGutters className="receipt-row-section">
            <Col className="receipt-row-text">
              {receipt.outcome.logs.length === 0 ? (
                "No logs"
              ) : (
                <pre>{receipt.outcome.logs.join("\n")}</pre>
              )}
            </Col>
          </Row>

          {receipt.outcome.outgoing_receipts &&
            receipt.outcome.outgoing_receipts.length > 0 &&
            receipt.outcome.outgoing_receipts.map(
              (executedReceipt: T.NestedReceiptWithOutcome) => (
                <Row
                  noGutters
                  className="executed-receipt-row"
                  key={executedReceipt.receipt_id}
                >
                  <Col>
                    <ReceiptRow receipt={executedReceipt} />
                  </Col>
                </Row>
              )
            )}
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

          .receipt-row-status {
            font-size: 12px;
            color: #999999;
            font-weight: 500;
          }
        `}</style>
      </Row>
    );
  }
}

export default ReceiptRow;
