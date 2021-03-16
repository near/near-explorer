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
  convertedReceiptHash: string;
  transaction: T.Transaction;
  receiptOutcomesById: object;
  receiptsById: object;
  convertedReceipt: boolean;
}

export default class extends React.Component<Props> {
  renderRow = (
    receiptOutcomesById: any,
    receiptsById: any,
    receiptHash: string,
    transaction: T.Transaction,
    convertedReceipt = false
  ) => {
    let receiptItem = receiptOutcomesById[receiptHash];
    let statusInfo;
    if (
      "SuccessValue" in (receiptItem.outcome.status as T.ReceiptSuccessValue)
    ) {
      const { SuccessValue } = receiptItem.outcome
        .status as T.ReceiptSuccessValue;
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
    } else if ("Failure" in (receiptItem.outcome.status as T.ReceiptFailure)) {
      const { Failure } = receiptItem.outcome.status as T.ReceiptFailure;
      statusInfo = (
        <>
          <i>Failure: </i>
          <pre>{JSON.stringify(Failure, null, 2)}</pre>
        </>
      );
    } else if (
      "SuccessReceiptId" in (receiptItem.outcome.status as T.ReceiptSuccessId)
    ) {
      const { SuccessReceiptId } = receiptItem.outcome
        .status as T.ReceiptSuccessId;
      statusInfo = (
        <>
          <i>SuccessReceiptId: </i>
          <pre>{SuccessReceiptId}</pre>
        </>
      );
    }

    let gasBurnedByReceipt = new BN(0);
    let tokensBurnedByReceipt = new BN(0);
    let gasBurnedByConvertation = new BN(0);
    let tokensBurnedByConvertation = new BN(0);
    if (
      receiptOutcomesById[receiptHash] &&
      receiptOutcomesById[receiptHash].outcome
    ) {
      gasBurnedByReceipt = new BN(
        receiptOutcomesById[receiptHash].outcome.gas_burnt
      );
      tokensBurnedByReceipt = new BN(
        receiptOutcomesById[receiptHash].outcome.tokens_burnt
      );
    }
    if (convertedReceipt) {
      gasBurnedByConvertation = transaction.transactionOutcome
        ? new BN(transaction.transactionOutcome.outcome.gas_burnt)
        : new BN(0);
      tokensBurnedByConvertation = transaction.transactionOutcome
        ? new BN(transaction.transactionOutcome.outcome.tokens_burnt)
        : new BN(0);
    }

    return (
      <Row
        noGutters
        className={
          !convertedReceipt ? "receipt-row pl-4 mx-0" : "receipt-converted-row"
        }
        key={receiptOutcomesById[receiptHash].id}
      >
        <Col>
          {convertedReceipt && (
            <>
              <Row noGutters>
                <Col className="receipt-row-title receipt-hash-title">
                  <b>Convert Transaction To Receipt</b>
                </Col>
              </Row>

              <Row noGutters className="receipt-row mx-0 pl-4">
                <Col className="receipt-row-title">Gas Burned:</Col>
                <Col className="receipt-row-receipt-hash">
                  {gasBurnedByConvertation ? (
                    <Gas gas={gasBurnedByConvertation} />
                  ) : (
                    "..."
                  )}
                </Col>
              </Row>

              <Row noGutters className="receipt-row mx-0 pl-4">
                <Col className="receipt-row-title">Tokens Burned:</Col>
                <Col className="receipt-row-receipt-hash">
                  {tokensBurnedByConvertation ? (
                    <Balance amount={tokensBurnedByConvertation.toString()} />
                  ) : (
                    "..."
                  )}
                </Col>
              </Row>
            </>
          )}
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
              title={receiptOutcomesById[receiptHash].id}
            >
              {truncateAccountId(receiptOutcomesById[receiptHash].id)}
            </Col>
          </Row>

          <Row noGutters className="receipt-row mx-0 pl-4">
            <Col className="receipt-row-title">Predecessor ID:</Col>
            <Col
              className="receipt-row-receipt-hash"
              title={
                receiptsById[receiptOutcomesById[receiptHash].id].predecessor_id
              }
            >
              {truncateAccountId(
                receiptsById[receiptOutcomesById[receiptHash].id].predecessor_id
              )}
            </Col>
          </Row>

          <Row noGutters className="receipt-row mx-0 pl-4">
            <Col className="receipt-row-title">Receiver ID:</Col>
            <Col
              className="receipt-row-receipt-hash"
              title={
                receiptsById[receiptOutcomesById[receiptHash].id].receiver_id
              }
            >
              {truncateAccountId(
                receiptsById[receiptOutcomesById[receiptHash].id].receiver_id
              )}
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
              {receiptsById[receiptOutcomesById[receiptHash].id]?.receipt &&
              receiptsById[receiptOutcomesById[receiptHash].id].receipt.length >
                0
                ? receiptsById[
                    receiptOutcomesById[receiptHash].id
                  ].receipt.map((action: T.Action, index: number) => (
                    <ActionRow
                      key={transaction.hash + index}
                      action={action}
                      transaction={transaction}
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
              {receiptOutcomesById[receiptHash].outcome.logs.length === 0 ? (
                "No logs"
              ) : (
                <pre>
                  {receiptOutcomesById[receiptHash].outcome.logs.join("\n")}
                </pre>
              )}
            </Col>
          </Row>

          {receiptOutcomesById[receiptHash]?.outcome.receipt_ids &&
            receiptOutcomesById[
              receiptHash
            ].outcome?.receipt_ids.map((executedReceiptHash: string) =>
              this.renderRow(
                receiptOutcomesById,
                receiptsById,
                executedReceiptHash,
                transaction
              )
            )}
        </Col>
      </Row>
    );
  };

  render() {
    const {
      convertedReceiptHash: receiptHash,
      receiptOutcomesById,
      receiptsById,
      transaction,
      convertedReceipt,
    } = this.props;

    return (
      <>
        {this.renderRow(
          receiptOutcomesById,
          receiptsById,
          receiptHash,
          transaction,
          convertedReceipt
        )}

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
