import React from "react";
import { Row, Col } from "react-bootstrap";

import * as T from "../../libraries/explorer-wamp/transactions";

import { displayArgs } from "./ActionMessage";

export interface Props {
  receipt: T.ReceiptsOutcomeList;
}

export default class extends React.Component<Props> {
  statusInfo = function (receipt: T.ReceiptsOutcomeList) {
    let statusInfo;

    if (receipt.status === "SUCCESS_VALUE") {
      if (receipt.args === null) {
        statusInfo = "No result";
      } else if (receipt.args && Object.keys(receipt.args).length === 0) {
        statusInfo = "Empty result";
      } else if (receipt.args && receipt.args.args_base64) {
        statusInfo = (
          <>
            <dl>
              <dt>Arguments:</dt>
              <dd>{displayArgs(receipt.args.args_base64)}</dd>
            </dl>
          </>
        );
      }
    } else if (receipt.status === "SUCCESS_RECEIPT_ID") {
      statusInfo = (
        <>
          <i>SuccessReceiptId:</i>
          <pre>{receipt.produced_receipt_id}</pre>
        </>
      );
    } else if (receipt.status === "FAILURE") {
      statusInfo = "FAILURE";
    }

    return statusInfo;
  };

  renderExecutedReceiptRow = (receipt: T.ReceiptsOutcomeList) => (
    <>
      <Row noGutters>
        <Col className="receipt-row-title">Receipt ID:</Col>
        <Col className="receipt-row-title">
          <b>{receipt.receipt_id}</b>
        </Col>
      </Row>

      <Row noGutters>
        <Col className="receipt-row-action-type">Action Kind:</Col>
        <Col className="receipt-row-action-type">
          <i>{receipt.action_kind}</i>
        </Col>
      </Row>

      <Row noGutters>
        <Col className="receipt-row-action-type">Receipt Kind:</Col>
        <Col className="receipt-row-action-type">
          <i>{receipt.receipt_kind}</i>
        </Col>
      </Row>

      <Row noGutters>
        <Col className="receipt-row-title">Status:</Col>
        <Col className="receipt-row-title">
          <i>{receipt.status}</i>
        </Col>
      </Row>

      <Row noGutters>
        <Col className="receipt-row-info">{this.statusInfo(receipt)}</Col>
      </Row>
    </>
  );

  render() {
    const { receipt } = this.props;

    return (
      <Row noGutters className="receipt-row mx-0">
        <Col className="receipt-row-details">
          <Row noGutters>
            <Col>
              {this.renderExecutedReceiptRow(receipt)}

              {receipt.producedReceipts && receipt.producedReceipts.length > 0 && (
                <Row noGutters>
                  <Col>
                    <Row noGutters>
                      <Col>
                        <b>Produces Receipts:</b>
                      </Col>
                    </Row>
                    {receipt.producedReceipts.map((produceReceipt) => (
                      <Row
                        key={produceReceipt.receipt_id}
                        noGutters
                        className="receipt-row mx-0 pl-4"
                      >
                        <Col>
                          {this.renderExecutedReceiptRow(produceReceipt)}

                          {produceReceipt.producedReceipts?.map((i) => (
                            <Row
                              noGutters
                              className="receipt-row mx-0 pl-4"
                              key={produceReceipt.receipt_id}
                            >
                              <Col>{this.renderExecutedReceiptRow(i)}</Col>
                            </Row>
                          ))}
                        </Col>

                        <hr />
                      </Row>
                    ))}
                  </Col>
                </Row>
              )}
            </Col>
          </Row>
        </Col>
        <style jsx global>{`
          .receipt-row {
            padding-top: 10px;
            padding-bottom: 10px;
            margin-bottom: 20px;
            padding-left: 20px;
            border-top: solid 2px #f8f8f8;
            border-left: 2px solid #000000;
          }

          .receipt-row-bottom {
            border-bottom: solid 2px #f8f8f8;
          }

          .receipt-row-title,
          .receipt-row-info,
          .receipt-row-action-type {
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
      </Row>
    );
  }
}
