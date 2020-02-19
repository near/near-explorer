import React from "react";

import actionIcons from "./ActionIcons";
import ActionMessage from "./ActionMessage";
import ActionRowBlock, { ViewMode, DetalizationMode } from "./ActionRowBlock";
import * as T from "../../libraries/explorer-wamp/transactions";

export interface Props {
  action: T.ActionWrapper;
  transaction: T.Transaction;
  viewMode: ViewMode;
  detalizationMode: DetalizationMode;
  className: string;
  showDetails?: boolean;
}

export interface State {}

export default class extends React.Component<Props, State> {
  static defaultProps = {
    viewMode: "sparse",
    detalizationMode: "detailed",
    className: "",
    showDetails: false
  };

  render() {
    const {
      viewMode,
      detalizationMode,
      className,
      transaction,
      action,
      showDetails
    } = this.props;
    let actionKind = action.kind as keyof T.Action;
    let actionArgs = action.args;
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
            showDetails={showDetails}
          />
        }
      />
    );
  }
}
