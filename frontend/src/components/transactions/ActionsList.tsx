import React from "react";
import * as T from "../../libraries/explorer-wamp/transactions";

import ActionRow from "./ActionRow";
import { ViewMode, DetalizationMode } from "./ActionRowBlock";

export interface Props {
  actions: T.Action[];
  transaction: T.Transaction;
  viewMode?: ViewMode;
  detalizationMode?: DetalizationMode;
  showDetails?: boolean;
}

class ActionList extends React.PureComponent<Props> {
  render() {
    const { transaction, viewMode, detalizationMode, showDetails } = this.props;
    let actionRows = this.props.actions.map((action, actionIndex) => (
      <ActionRow
        key={transaction.hash + actionIndex}
        action={action}
        transaction={transaction}
        viewMode={viewMode}
        detalizationMode={detalizationMode}
        showDetails={showDetails}
      />
    ));

    return <>{actionRows}</>;
  }
}

export default ActionList;
