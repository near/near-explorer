import React from "react";
import * as T from "../../libraries/explorer-wamp/transactions";

import ActionRow, { ViewMode, DetalizationMode } from "./ActionRow";

export interface Props {
  actions: (T.Action | keyof T.Action)[];
  transaction: T.Transaction;
  viewMode?: ViewMode;
  detalizationMode?: DetalizationMode;
  reversed?: boolean;
}

export default class extends React.Component<Props> {
  render() {
    const {
      actions,
      transaction,
      viewMode,
      detalizationMode,
      reversed
    } = this.props;
    let actionRows = actions.map((action, actionIndex) => (
      <ActionRow
        key={transaction.hash + actionIndex}
        action={action}
        transaction={transaction}
        viewMode={viewMode}
        detalizationMode={detalizationMode}
      />
    ));

    if (reversed && actionRows) {
      actionRows.reverse();
    }

    return <>{actionRows}</>;
  }
}
