import * as T from "../../libraries/explorer-wamp/transactions";

import ActionsList from "./ActionsList";
import { ViewMode } from "./ActionRow";

export interface Props {
  transactions: T.Transaction[];
  viewMode?: ViewMode;
}

export default ({ transactions, viewMode }: Props) => {
  return (
    <>
      {transactions.map(transaction => (
        <ActionsList
          key={transaction.hash}
          actions={transaction.actions.reverse()}
          transaction={transaction}
          viewMode={viewMode}
        />
      ))}
    </>
  );
};
