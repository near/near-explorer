import React from "react";

import actionIcons from "./ActionIcons";
import ActionMessage from "./ActionMessage";
import ActionRowBlock, { ViewMode, DetalizationMode } from "./ActionRowBlock";
import * as T from "../../libraries/explorer-wamp/transactions";
import { DbReceiptInfo } from "../../libraries/explorer-wamp/receipts";

export interface Props {
  action: T.Action;
  actionBlock: DbReceiptInfo | T.TransactionInfo;
  actionLink?: React.ReactNode;
  viewMode: ViewMode;
  detalizationMode: DetalizationMode;
  className: string;
  showDetails?: boolean;
  status?: React.ReactNode;
  isFinal?: boolean;
}

class ActionRow extends React.PureComponent<Props> {
  static defaultProps = {
    viewMode: "sparse",
    detalizationMode: "detailed",
    className: "",
    showDetails: false,
  };

  render() {
    const {
      viewMode,
      detalizationMode,
      className,
      actionBlock,
      actionLink,
      action,
      showDetails,
      status,
      isFinal,
    } = this.props;
    const ActionIcon = actionIcons[action.kind];
    return (
      <ActionRowBlock
        viewMode={viewMode}
        detalizationMode={detalizationMode}
        className={className}
        actionBlock={actionBlock}
        actionLink={actionLink}
        icon={ActionIcon && <ActionIcon />}
        title={
          <ActionMessage
            transaction={actionBlock}
            actionKind={action.kind}
            actionArgs={action.args}
            showDetails={showDetails}
          />
        }
        status={status}
        isFinal={isFinal}
      />
    );
  }
}

export default ActionRow;
