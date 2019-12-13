import React from "react";
import * as T from "../../libraries/explorer-wamp/transactions";

import ActionRow, { ViewMode } from "./ActionRow";

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
    let batch = false;
    const { actions, transaction, viewMode, reversed } = this.props;
    if (actions.length !== 1) {
      batch = true;
    }
    let actionRows = actions.map((action, actionIndex) => (
      <ActionRow
        key={transaction.hash + actionIndex}
        action={action}
        transaction={transaction}
        viewMode={viewMode}
        batch={batch}
      />
    ));
    if (reversed && actionRows) {
      actionRows.reverse();
    }

    return (
      <div className="action-row-bottom">
        {batch ? (
          <div className={`action-${viewMode}-row mx-0`}>
            <img
              src="/static/images/icon-m-batch.svg"
              className="action-row-img"
            />
            Batch Transaction
          </div>
        ) : null}
        {actionRows}
      </div>
    );
  }
}
