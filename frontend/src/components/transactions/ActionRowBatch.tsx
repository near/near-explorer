import React from "react";
import { Row, Col } from "react-bootstrap";

import actionIcons from "./ActionIcons";
import ActionMessage from "./ActionMessage";
import * as T from "../../libraries/explorer-wamp/transactions";

export type ViewMode = "sparse" | "compact";

export interface Props {
  action: T.Action | keyof T.Action;
  transaction: T.Transaction;
  viewMode: ViewMode;
  className: string;
}

export interface State {}

export default class extends React.Component<Props, State> {
  static defaultProps = {
    viewMode: "sparse",
    className: ""
  };

  render() {
    const { viewMode, className, transaction, action } = this.props;

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
  }
}
