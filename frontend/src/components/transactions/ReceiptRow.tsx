import React from "react";
import { Row, Col } from "react-bootstrap";

import * as T from "../../libraries/explorer-wamp/transactions";

export interface Props {
  receipt: T.ReceiptOutcome;
}

export default class extends React.Component<Props> {
  render() {
    const { receipt } = this.props;
    console.log(receipt.id);
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
            <pre>{SuccessValue}</pre>
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
      "SuccessReceiptId" in (receipt.outcome.status as T.ReceiptSucessId)
    ) {
      const ReceiptId = receipt.outcome.receipt_ids;
      statusInfo = (
        <>
          <i>SuccessReceiptId: </i>
          <pre>
            {ReceiptId.map(id => {
              return <>{id} </>;
            })}
          </pre>
        </>
      );
    }

    return (
      <Row noGutters className="receipt-row mx-0">
        <Col className="receipt-row-details">
          <Row noGutters>
            <Col md="8" xs="7">
              <Row noGutters>
                <Col className="receipt-row-title">{statusInfo}</Col>
              </Row>
              <Row noGutters>
                <Col className="receipt-row-text">
                  {receipt.outcome.logs.length === 0 ? (
                    "No logs"
                  ) : (
                    <pre>{receipt.outcome.logs.join("\n")}</pre>
                  )}
                </Col>
              </Row>
            </Col>
            <Col md="4" xs="5" className="ml-auto text-right">
              <Row>
                <Col className="receipt-row-receipt-hash">
                  {`${receipt.id.substr(0, 7)}...`}
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <style jsx global>{`
          .receipt-row {
            padding-top: 10px;
            padding-bottom: 10px;
            border-top: solid 2px #f8f8f8;
          }

          .receipt-row-bottom {
            border-bottom: solid 2px #f8f8f8;
          }

          .receipt-row-title {
            font-family: BentonSans;
            font-size: 14px;
            line-height: 1.29;
            color: #24272a;
          }

          .receipt-row-text {
            font-family: BentonSans;
            font-size: 12px;
            line-height: 1.5;
            color: #999999;
          }

          .receipt-row-receipt-hash {
            font-family: BentonSans;
            font-size: 14px;
            font-weight: 500;
            line-height: 1.29;
          }

          .receipt-row-status {
            font-family: BentonSans;
            font-size: 12px;
            color: #999999;
            font-weight: 500;
          }
        `}</style>
      </Row>
    );
  }
}
