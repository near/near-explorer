import React from "react";
import * as T from "../../libraries/explorer-wamp/transactions";

import ActionRow from "./ActionRow";
import { ViewMode, DetalizationMode } from "./ActionRowBlock";

export interface Props {
  actions: (T.Action | keyof T.Action)[];
  transaction: T.Transaction;
  viewMode?: ViewMode;
  detalizationMode?: DetalizationMode;
  reversed?: boolean;
  showArg?: boolean;
}

export default class extends React.Component<Props> {
  render() {
    const { transaction, viewMode, detalizationMode, showArg } = this.props;
    let actionRows = this.props.actions.map((action, actionIndex) => (
      <ActionRow
        key={transaction.hash + actionIndex}
        action={action}
        transaction={transaction}
        viewMode={viewMode}
        detalizationMode={detalizationMode}
        showArg={showArg}
      />
    ));

    if (this.props.reversed) {
      actionRows.reverse();
    }

    return <>{actionRows}</>;
  }
}
