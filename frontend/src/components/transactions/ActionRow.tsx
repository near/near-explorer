import React from "react";
import { Row, Col } from "react-bootstrap";

import AccountLink from "../utils/AccountLink";
import TransactionLink from "../utils/TransactionLink";
import Timer from "../utils/Timer";
import actionIcons from "./ActionIcons";
import ActionMessage from "./ActionMessage";
import * as T from "../../libraries/explorer-wamp/transactions";

export type ViewMode = "sparse" | "compact";

export interface Props {
  action: T.Action | keyof T.Action;
  transaction: T.Transaction;
  viewMode: ViewMode;
  className: string;
  batch: boolean;
}

export interface State {}

export default class extends React.Component<Props, State> {
  static defaultProps = {
    viewMode: "sparse",
    className: "",
    batch: false
  };

  render() {
    const { viewMode, className, transaction, action, batch } = this.props;

    let actionKind: keyof T.Action;
    let actionArgs: T.Action;
    if (typeof action === "string") {
      actionKind = action;
      actionArgs = {} as T.Action;
    } else {
      actionKind = Object.keys(action)[0] as keyof T.Action;
      actionArgs = action[actionKind] as T.Action;
    }

    const ActionIcon = actionIcons[actionKind];
    return (
      <Row noGutters className={`action-${viewMode}-row mx-0 ${className}`}>
        <Col xs="auto" className="actions-icon-col">
          {batch ? (
            <div className="action-row-img" style={{ marginLeft: "30px" }}>
              {ActionIcon && <ActionIcon />}
            </div>
          ) : (
            <div className="action-row-img">{ActionIcon && <ActionIcon />}</div>
          )}

          {viewMode === "sparse" ? (
            <img
              src="/static/images/icon-arrow-right.svg"
              className="action-row-toggler"
            />
          ) : null}
        </Col>
        <Col className="action-row-details">
          <Row noGutters>
            <Col md="8" xs="7">
              <Row noGutters>
                <Col className="action-row-title">
                  <ActionMessage
                    transaction={transaction}
                    actionKind={actionKind}
                    actionArgs={actionArgs}
                  />
                </Col>
              </Row>
              <Row noGutters>
                <Col className="action-row-text">
                  by <AccountLink accountId={transaction.signerId} />
                </Col>
              </Row>
            </Col>
            <Col md="4" xs="5" className="ml-auto text-right">
              <Row>
                <Col className="action-row-txid">
                  <TransactionLink transactionHash={transaction.hash} />
                </Col>
              </Row>
              <Row>
                <Col className="action-row-timer">
                  <span className="action-row-timer-status">{`Completed`}</span>{" "}
                  <Timer time={transaction.blockTimestamp} />
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <style jsx global>{`
          .action-sparse-row,
          .action-compact-row {
            font-family: BentonSans;
            margin-top: 5px;
            margin-bottpm: 10px;
            padding-top: 10px;
            padding-bottom: 5px;
          }

          .action-compact-row .action-row-details {
            padding-bottom: 8px;
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
            height: 20px;
            width: 20px;
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
            line-height: 1.29;
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
        `}</style>
      </Row>
    );
  }
}
