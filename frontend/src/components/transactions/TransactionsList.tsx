import React from "react";
import * as T from "../../libraries/explorer-wamp/transactions";

import TransactionAction from "./TransactionAction";
import { ViewMode } from "./ActionRowBlock";

export interface Props {
  transactions: T.Transaction[];
  viewMode?: ViewMode;
}

export default class extends React.Component<Props> {
  render() {
    const { transactions, viewMode } = this.props;
    let actions = transactions.map(transaction => (
      <TransactionAction
        key={transaction.hash}
        actions={transaction.actions}
        transaction={transaction}
        viewMode={viewMode}
      />
    ));

    return <>{actions}</>;
  }
}
