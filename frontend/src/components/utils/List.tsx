import React from "react";
import * as T from "../../libraries/explorer-wamp/transactions";
import * as A from "../../libraries/explorer-wamp/accounts";
import AccountRow from "../accounts/AccountRow";
import TransactionAction from "../transactions/TransactionAction";
import { ViewMode } from "../transactions/ActionRowBlock";

export type GenreMode = "Transaction" | "Account";

export interface Props {
  lists: T.Transaction[] | A.AccountBasicInfo[];
  genre: GenreMode;
  viewMode?: ViewMode;
  reversed?: boolean;
}

export default class extends React.Component<Props> {
  render() {
    const { lists, genre, viewMode, reversed } = this.props;
    let rows;
    if (genre === "Transaction") {
      const txLists = lists as T.Transaction[];
      rows = txLists.map((transaction: T.Transaction) => (
        <TransactionAction
          key={transaction.hash}
          actions={transaction.actions}
          transaction={transaction}
          viewMode={viewMode}
          reversed={reversed}
        />
      ));
      if (reversed) {
        rows.reverse();
      }
    }
    if (genre === "Account") {
      const accountLists = lists as A.AccountBasicInfo[];
      rows = accountLists.map((account: A.AccountBasicInfo, index: number) => (
        <AccountRow
          key={account.id + index}
          accountId={account.id}
          timestamp={account.timestamp}
        />
      ));
    }

    return <>{rows}</>;
  }
}
