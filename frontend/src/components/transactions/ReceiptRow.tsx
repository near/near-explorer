import React from "react";
import { Row, Col } from "react-bootstrap";

import * as T from "../../libraries/explorer-wamp/transactions";

export interface Props {
  receipt: T.Receipt;
}

export interface State {}

export default class extends React.Component<Props, State> {
  render() {
    const { receipt } = this.props;

    return (
      <Row noGutters className="receipt-row mx-0">
        <Col className="receipt-row-details">
          <Row noGutters>
            <Col md="8" xs="7">
              <Row noGutters>
                <Col className="receipt-row-title">
                  {receipt.result.result === null ? (
                    "No result"
                  ) : receipt.result.result.length === 0 ? (
                    "Empty result"
                  ) : (
                    <>
                      <i>Result:</i> <pre>{receipt.result.result}</pre>
                    </>
                  )}
                </Col>
              </Row>
              <Row noGutters>
                <Col className="receipt-row-text">
                  {receipt.result.logs.length === 0 ? (
                    "No logs"
                  ) : (
                    <pre>{receipt.result.logs.join("\n")}</pre>
                  )}
                </Col>
              </Row>
            </Col>
            <Col md="4" xs="5" className="ml-auto text-right">
              <Row>
                <Col className="receipt-row-receipt-hash">
                  {`${receipt.hash.substr(0, 7)}...`}
                </Col>
              </Row>
              <Row>
                <Col className="receipt-row-status">
                  {receipt.result.status}
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
            color: #0072ce;
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
