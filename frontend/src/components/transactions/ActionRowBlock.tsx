import React from "react";
import { Row, Col } from "react-bootstrap";

import AccountLink from "../utils/AccountLink";
import ExecutionStatus from "../utils/ExecutionStatus";
import TransactionLink from "../utils/TransactionLink";
import Timer from "../utils/Timer";
import * as T from "../../libraries/explorer-wamp/transactions";

export type ViewMode = "sparse" | "compact";
export type DetalizationMode = "detailed" | "minimal";
export interface Props {
  transaction: T.Transaction;
  viewMode: ViewMode;
  detalizationMode: DetalizationMode;
  className: string;
  icon: React.ReactElement;
  title: React.ReactElement | string;
  children?: React.ReactNode;
  status?: T.ExecutionStatus;
  isFinal?: boolean;
}

export interface State {}

export default class extends React.Component<Props, State> {
  static defaultProps = {
    viewMode: "sparse",
    detalizationMode: "detailed",
    className: "",
  };

  render() {
    const {
      viewMode,
      detalizationMode,
      className,
      transaction,
      icon,
      title,
      status,
      isFinal,
      children,
    } = this.props;

    return (
      <>
        <Row noGutters className={`action-${viewMode}-row mx-0 ${className}`}>
          <Col xs="auto">
            <div className="action-row-img">{icon}</div>
          </Col>
          <Col className="action-row-details">
            <Row noGutters className="action-row-message">
              <Col md="8" xs="7">
                <Row noGutters>
                  <Col className="action-row-title">{title}</Col>
                </Row>
                {detalizationMode === "detailed" ? (
                  <Row noGutters>
                    <Col className="action-row-text">
                      by <AccountLink accountId={transaction.signerId} />
                    </Col>
                  </Row>
                ) : null}
              </Col>
              {detalizationMode === "detailed" ? (
                <Col md="4" xs="5" className="ml-auto text-right">
                  <Row>
                    <Col className="action-row-txid">
                      <TransactionLink transactionHash={transaction.hash} />
                    </Col>
                  </Row>
                  <Row>
                    <Col className="action-row-timer">
                      <span className="action-row-timer-status">
                        {status ? (
                          <ExecutionStatus status={status} />
                        ) : (
                          "Fetching Status..."
                        )}
                        {isFinal === undefined
                          ? "/Checking Finality..."
                          : isFinal === true
                          ? "/Finalized"
                          : "/Finalizing"}
                      </span>{" "}
                      <Timer time={transaction.blockTimestamp} />
                    </Col>
                  </Row>
                </Col>
              ) : null}
            </Row>
            {children}
          </Col>
        </Row>
        <style jsx global>
          {`
            .action-sparse-row {
              padding-top: 10px;
              padding-bottom: 10px;
              border-top: solid 2px #f8f8f8;
            }
            .action-sparse-row .action-sparse-row {
              border-top: 0;
            }

            .action-sparse-row,
            .action-compact-row {
              font-family: BentonSans;
            }

            .action-compact-row .action-row-message {
              margin-bottom: 1em;
            }

            .action-compact-row .action-row-details {
              border-bottom: 2px solid #f8f8f8;
              margin: 0.1em 0 0;
              padding-bottom: 8px;
            }

            .action-row-details .action-row-details {
              border: 0;
            }

            .action-compact-row .action-row-img {
              width: 24px;
              height: 24px;
              border: solid 2px #f8f8f8;
              background-color: #ffffff;
              border-radius: 50%;
              margin-right: 8px;
              text-align: center;
              line-height: 1.1;
            }

            .action-sparse-row .action-row-img {
              margin: 10px;
              display: inline;
              height: 20px;
              width: 20px;
            }

            .action-sparse-row .action-row-img svg {
              height: 16px;
              width: 16px;
            }

            .action-row-bottom {
              border-bottom: solid 2px #f8f8f8;
            }

            .action-compact-row .action-row-img svg {
              height: 12px;
              width: 12px;
            }

            .action-sparse-row .action-row-toggler {
              width: 10px;
              margin: 10px;
            }

            .action-row-title {
              font-family: BentonSans;
              font-size: 14px;
              font-weight: 500;
              color: #24272a;
            }

            .action-row-title a {
              color: #666;
            }

            .action-row-title a:hover {
              color: #24272a;
            }

            .action-row-text {
              font-family: BentonSans;
              font-size: 12px;
              font-weight: 500;
              line-height: 1.5;
              color: #999999;
            }

            .action-row-text a {
              color: #999999;
            }

            .action-row-text a:hover {
              color: #24272a;
            }

            .action-row-txid {
              font-family: BentonSans;
              font-size: 14px;
              font-weight: 500;
              line-height: 1.29;
              color: #0072ce;
            }

            .action-row-timer {
              font-family: BentonSans;
              font-size: 12px;
              color: #999999;
              font-weight: 100;
            }

            .action-row-timer-status {
              font-weight: 500;
            }

            pre {
              white-space: pre-wrap; /* Since CSS 2.1 */
              white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
              white-space: -pre-wrap; /* Opera 4-6 */
              white-space: -o-pre-wrap; /* Opera 7 */
              word-wrap: break-word; /* Internet Explorer 5.5+ */
            }
          `}
        </style>
      </>
    );
  }
}
