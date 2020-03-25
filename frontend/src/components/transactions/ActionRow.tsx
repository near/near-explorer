import React from "react";

import actionIcons from "./ActionIcons";
import ActionMessage from "./ActionMessage";
import ActionRowBlock, { ViewMode, DetalizationMode } from "./ActionRowBlock";
import * as T from "../../libraries/explorer-wamp/transactions";

export interface Props {
  action: T.Action;
  transaction: T.Transaction;
  viewMode: ViewMode;
  detalizationMode: DetalizationMode;
  className: string;
  showDetails?: boolean;
}

export default class extends React.Component<Props> {
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
    const ActionIcon = actionIcons[action.kind];
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
            actionKind={action.kind}
            actionArgs={action.args}
            showDetails={showDetails}
          />
        }
      />
    );
  }
}
