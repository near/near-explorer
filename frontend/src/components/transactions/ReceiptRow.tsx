import BN from "bn.js";
import React from "react";
import { Row, Col } from "react-bootstrap";

import ActionRow from "./ActionRow";

import * as T from "../../libraries/explorer-wamp/transactions";
import Gas from "../utils/Gas";
import Balance from "../utils/Balance";
import { truncateAccountId } from "../../libraries/formatting";
import { displayArgs } from "./ActionMessage";

export interface Props {
  receipt: T.ExecutionOutcomeReceipts;
}

class ReceiptRow extends React.Component<Props> {
  renderRow = (
    receipt: T.ExecutionOutcomeReceipts,
    convertedReceipt = true
  ) => {
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
        className={
          !convertedReceipt ? "receipt-row pl-4 mx-0" : "receipt-converted-row"
        }
        key={receipt.receipt_id}
      >
        <Col>
          <Row
            noGutters
            className={
              !convertedReceipt ? "" : "receipt-row receipt-converted-row"
            }
          >
            <Col className="receipt-row-title receipt-hash-title">
              <b>Receipt ID:</b>
            </Col>
            <Col
              className="receipt-row-receipt-hash ml-auto text-right"
              title={receipt.receipt_id}
            >
              {truncateAccountId(receipt.receipt_id)}
            </Col>
          </Row>

          <Row noGutters className="receipt-row mx-0 pl-4">
            <Col className="receipt-row-title">Predecessor ID:</Col>
            <Col
              className="receipt-row-receipt-hash"
              title={receipt.predecessor_id}
            >
              {truncateAccountId(receipt.predecessor_id)}
            </Col>
          </Row>

          <Row noGutters className="receipt-row mx-0 pl-4">
            <Col className="receipt-row-title">Receiver ID:</Col>
            <Col
              className="receipt-row-receipt-hash"
              title={receipt.receiver_id}
            >
              {truncateAccountId(receipt.receiver_id)}
            </Col>
          </Row>

          <Row noGutters className="receipt-row mx-0 pl-4">
            <Col className="receipt-row-title">Gas Burned:</Col>
            <Col className="receipt-row-receipt-hash">
              {gasBurnedByReceipt ? <Gas gas={gasBurnedByReceipt} /> : "..."}
            </Col>
          </Row>

          <Row noGutters className="receipt-row mx-0 pl-4">
            <Col className="receipt-row-title">Tokens Burned:</Col>
            <Col className="receipt-row-receipt-hash">
              {tokensBurnedByReceipt ? (
                <Balance amount={tokensBurnedByReceipt.toString()} />
              ) : (
                "..."
              )}
            </Col>
          </Row>

          <Row noGutters className="receipt-row mx-0 pl-4">
            <Col className="receipt-row-text">
              {receipt?.actions && receipt.actions.length > 0
                ? receipt.actions.map((action: T.Action, index: number) => (
                    <ActionRow
                      key={receipt.receipt_id + index}
                      action={action}
                      transaction={
                        {
                          receiverId: receipt.receiver_id,
                        } as T.TransactionInfo
                      }
                      detalizationMode="minimal"
                      showDetails
                    />
                  ))
                : "No actions"}
            </Col>
          </Row>

          <Row noGutters className="receipt-row mx-0 pl-4">
            <Col className="receipt-row-status">{statusInfo}</Col>
          </Row>

          <Row noGutters className="receipt-row mx-0 pl-4">
            <Col className="receipt-row-text">
              {receipt.outcome.logs.length === 0 ? (
                "No logs"
              ) : (
                <pre>{receipt.outcome.logs.join("\n")}</pre>
              )}
            </Col>
          </Row>

          {receipt.outcome.receipt_ids &&
            receipt.outcome.receipt_ids.length > 0 &&
            receipt.outcome.receipt_ids.map(
              (executedReceipt: T.ExecutionOutcomeReceipts) =>
                this.renderRow(executedReceipt, false)
            )}
        </Col>
      </Row>
    );
  };

  render() {
    return (
      <>
        {this.renderRow(this.props.receipt)}

        <style jsx global>{`
          .receipt-converted-row {
            padding-bottom: 30px;
          }

          .receipt-converted-row.receipt-row {
            border-left: none;
            padding-bottom: 0;
          }

          .receipt-row {
            padding-top: 10px;
            border-left: 2px solid #e5e5e5;
          }

          .receipt-hash-title {
            padding-bottom: 10px;
          }

          .receipt-row-bottom {
            border-bottom: solid 2px #f8f8f8;
          }

          .receipt-row-title,
          .receipt-row-info {
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
          }

          .receipt-row-status {
            font-size: 12px;
            color: #999999;
            font-weight: 500;
          }
        `}</style>
      </>
    );
  }
}

export default ReceiptRow;
