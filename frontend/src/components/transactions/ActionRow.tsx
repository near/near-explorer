import React from "react";

import actionIcons from "./ActionIcons";
import ActionMessage from "./ActionMessage";
import ActionRowBlock, { ViewMode, DetalizationMode } from "./ActionRowBlock";
import * as T from "../../libraries/explorer-wamp/transactions";

export interface Props {
  action: {
    kind: string;
    args: T.Action[keyof T.Action];
  };
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
      // action,
      showDetails
    } = this.props;
    // console.log(action)
    // let actionKind: keyof T.Action;
    // let actionArgs: T.Action;
    // if (typeof action === "string") {
    //   actionKind = action;
    //   actionArgs = {} as T.Action;
    // } else {
    //   actionKind = Object.keys(action)[0] as keyof T.Action;
    //   actionArgs = action[actionKind] as T.Action;
    // }

    const ActionIcon = actionIcons["CreateAccount"];
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
            actionKind={"CreateAccount"}
            actionArgs={"actionArgs"}
            showDetails={showDetails}
          />
        }
      />
    );
  }
}
