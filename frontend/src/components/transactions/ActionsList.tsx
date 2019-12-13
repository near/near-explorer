import React from "react";
import { Row, Col } from "react-bootstrap";
import * as T from "../../libraries/explorer-wamp/transactions";

import ActionRow, { ViewMode } from "./ActionRow";
import ActionRowBatch from "./ActionRowBatch";

import AccountLink from "../utils/AccountLink";
import TransactionLink from "../utils/TransactionLink";
import Timer from "../utils/Timer";

export interface Props {
  actions: (T.Action | keyof T.Action)[];
  transaction: T.Transaction;
  viewMode?: ViewMode;
  reversed?: boolean;
}

export default class extends React.Component<Props> {
  static defaultProps = {
    viewMode: "sparse"
  };

  render() {
    const { actions, transaction, viewMode, reversed } = this.props;
    let actionRows;
    let batch = false;
    if (actions.length === 1) {
      actionRows = actions.map((action, actionIndex) => (
        <ActionRow
          key={transaction.hash + actionIndex}
          action={action}
          transaction={transaction}
          viewMode={viewMode}
        />
      ));
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
        {batch ? (
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
                      <span className="action-row-timer-status">{`Completed`}</span>{" "}
                      <Timer time={transaction.blockTimestamp} />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        ) : null}
        {actionRows}
      </>
    );
  }
}
