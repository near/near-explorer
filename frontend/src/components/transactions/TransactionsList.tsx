import React from "react";
import * as T from "../../libraries/explorer-wamp/transactions";

import ActionsList from "./ActionsList";
import { ViewMode } from "./ActionRow";

export interface Props {
  transactions: T.Transaction[];
  viewMode?: ViewMode;
  reversed?: boolean;
}

export default class extends React.Component<Props> {
  render() {
    const { transactions, viewMode, reversed } = this.props;
    let actions = transactions.map(transaction => (
      <ActionsList
        key={transaction.hash}
        actions={transaction.actions}
        transaction={transaction}
        viewMode={viewMode}
        reversed={reversed}
      />
    ));

    if (reversed) {
      actions.reverse();
    }

    return <>{actions}</>;
  }
}
