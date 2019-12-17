import React from "react";
import { Row, Col } from "react-bootstrap";
import * as T from "../../libraries/explorer-wamp/transactions";

import ActionRow, { ViewMode } from "./ActionRow";
import ActionRowBatch from "./ActionRowBatch";

import AccountLink from "../utils/AccountLink";
import TransactionLink from "../utils/TransactionLink";
import ExecutionStatus from "../utils/ExecutionStatus";
import Timer from "../utils/Timer";

export interface Props {
  actions: (T.Action | keyof T.Action)[];
  transaction: T.Transaction;
  viewMode?: ViewMode;
  reversed?: boolean;
  TD?: boolean;
}

export default class extends React.Component<Props> {
  static defaultProps = {
    viewMode: "sparse",
    TD: false
  };

  render() {
    const { actions, transaction, viewMode, reversed, TD } = this.props;
    let actionRows;
    let batch = false;

    if (actions.length === 1) {
      if (TD) {
        actionRows = actions.map((action, actionIndex) => (
          <ActionRowBatch
            key={transaction.hash + actionIndex}
            action={action}
            transaction={transaction}
            viewMode={viewMode}
          />
        ));
      } else {
        actionRows = actions.map((action, actionIndex) => (
          <ActionRow
            key={transaction.hash + actionIndex}
            action={action}
            transaction={transaction}
            viewMode={viewMode}
          />
        ));
      }
    } else {
      batch = true;
      actionRows = actions.map((action, actionIndex) => (
        <ActionRowBatch
          key={transaction.hash + actionIndex}
          action={action}
          transaction={transaction}
          viewMode={viewMode}
        />
      ));
    }

    if (reversed && actionRows) {
      actionRows.reverse();
    }

    return (
      <>
        {batch && !TD ? (
          <Row noGutters className={`action-${viewMode}-row mx-0`}>
            <Col xs="auto">
              <img
                src="/static/images/icon-m-batch.svg"
                className="action-row-img"
              />
            </Col>
            <Col className="action-row-details">
              <Row noGutters>
                <Col md="8" xs="7">
                  <Row noGutters>
                    <Col className="action-row-title">Batch Transaction</Col>
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
                      <span className="action-row-timer-status">
                        <ExecutionStatus status={transaction.status} />
                      </span>{" "}
                      <Timer time={transaction.blockTimestamp} />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        ) : null}
        {actionRows}
        <style jsx global>{`
          .action-sparse-row {
            padding-top: 10px;
            padding-bottom: 10px;
            border-top: solid 2px #f8f8f8;
          }

          .action-sparse-row,
          .action-compact-row {
            font-family: BentonSans;
          }

          .action-compact-row .action-row-details {
            border-bottom: 2px solid #f8f8f8;
            margin-bottom: 15px;
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

          .actions-icon-col {
            margin-left: 30px;
          }
        `}</style>
      </>
    );
  }
}
