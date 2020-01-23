import React from "react";
import * as A from "../../libraries/explorer-wamp/accounts";
import AccountRow from "./AccountRow";

export interface Props {
  accounts: A.AccountBasicInfo[];
}

export default class extends React.Component<Props> {
  render() {
    const { accounts } = this.props;
    let accountRow = accounts.map((account, index) => (
      <AccountRow
        key={account.id + index}
        accountId={account.id}
        timestamp={account.timestamp}
      />
    ));
    return <>{accountRow}</>;
  }
}
