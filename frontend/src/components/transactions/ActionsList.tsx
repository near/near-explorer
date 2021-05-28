import React from "react";
import * as T from "../../libraries/explorer-wamp/transactions";

import ActionRow from "./ActionRow";
import { ViewMode, DetalizationMode } from "./ActionRowBlock";

export interface Props {
  actions: T.Action[];
  actionLink?: React.ReactNode;
  actionBlock: any;
  viewMode?: ViewMode;
  detalizationMode?: DetalizationMode;
  showDetails?: boolean;
}

class ActionList extends React.PureComponent<Props> {
  render() {
    const {
      actionBlock,
      actionLink,
      viewMode,
      detalizationMode,
      showDetails,
    } = this.props;

    let actionRows = this.props.actions.map((action, actionIndex) => (
      <ActionRow
        key={(actionBlock.hash || actionBlock.receiptId) + actionIndex}
        action={action}
        actionBlock={actionBlock}
        actionLink={actionLink}
        viewMode={viewMode}
        detalizationMode={detalizationMode}
        showDetails={showDetails}
      />
    ));

    return <>{actionRows}</>;
  }
}

export default ActionList;
