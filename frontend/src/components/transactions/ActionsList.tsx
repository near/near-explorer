import * as T from "../../libraries/explorer-wamp/transactions";

import ActionRow, { ViewMode } from "./ActionRow";

export interface Props {
  actions: (T.Action | keyof T.Action)[];
  transaction: T.Transaction;
  viewMode?: ViewMode;
  reversed?: boolean;
}

export default ({ actions, transaction, viewMode, reversed }: Props) => {
  let actionRows = actions.map((action, actionIndex) => (
    <ActionRow
      key={transaction.hash + actionIndex}
      action={action}
      transaction={transaction}
      viewMode={viewMode}
    />
  ));

  if (reversed) {
    actionRows.reverse();
  }

  return <>{actionRows}</>;
};
