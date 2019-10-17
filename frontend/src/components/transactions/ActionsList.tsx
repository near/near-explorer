import * as T from "../../libraries/explorer-wamp/transactions";

import ActionRow, { ViewMode } from "./ActionRow";

export interface Props {
  actions: T.Action[];
  transaction: T.Transaction;
  viewMode?: ViewMode;
}

export default ({ actions, transaction, viewMode }: Props) => (
  <>
    {actions.map((action, actionIndex) => (
      <ActionRow
        key={transaction.hash + actionIndex}
        action={action}
        transaction={transaction}
        viewMode={viewMode}
      />
    ))}
  </>
);
