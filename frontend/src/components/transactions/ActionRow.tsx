import React from "react";
import { Row, Col } from "react-bootstrap";

import AccountLink from "../utils/AccountLink";
import ExecutionStatus from "../utils/ExecutionStatus";
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
  detail: boolean;
}

export interface State {}

export default class extends React.Component<Props, State> {
  static defaultProps = {
    viewMode: "sparse",
    className: "",
    detail: false
  };

  render() {
    const {
      viewMode,
      className,
      transaction,
      action,
      batch,
      detail
    } = this.props;

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
    let actionRow;
    if (detail || batch) {
      actionRow = (
        <Row noGutters className={`action-${viewMode}-row mx-0 ${className}`}>
          <Col xs="auto" className="actions-icon-col">
            <div className="action-row-img">{ActionIcon && <ActionIcon />}</div>
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
              </Col>
            </Row>
          </Col>
        </Row>
      );
    } else {
      actionRow = (
        <Row noGutters className={`action-${viewMode}-row mx-0 ${className}`}>
          <Col xs="auto">
            <div className="action-row-img">{ActionIcon && <ActionIcon />}</div>
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
      );
    }

    return <>{actionRow}</>;
  }
}
