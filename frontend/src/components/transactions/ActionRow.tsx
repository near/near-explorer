import React from "react";

import actionIcons from "./ActionIcons";
import ActionMessage from "./ActionMessage";
import ActionRowBlock, { ViewMode, DetalizationMode } from "./ActionRowBlock";
import * as T from "../../libraries/explorer-wamp/transactions";

export interface Props {
  action: T.Action | keyof T.Action;
  transaction: T.Transaction;
  viewMode: ViewMode;
  detalizationMode: DetalizationMode;
  className: string;
}

export interface State {}

export default class extends React.Component<Props, State> {
  static defaultProps = {
    viewMode: "sparse",
    detalizationMode: "detailed",
    className: ""
  };

  render() {
    const {
      viewMode,
      detalizationMode,
      className,
      transaction,
      action
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
    return (
      <ActionRowBlock
        viewMode={viewMode}
        detalizationMode={detalizationMode}
        className={className}
        transaction={transaction}
        icon={ActionIcon && <ActionIcon />}
        title={
          <ActionMessage
            transaction={transaction}
            actionKind={actionKind}
            actionArgs={actionArgs}
          />
        }
      />
    );
  }
}
