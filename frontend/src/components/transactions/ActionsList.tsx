import { PureComponent } from "react";
import * as T from "../../libraries/explorer-wamp/transactions";

import ActionRow from "./ActionRow";
import { ViewMode, DetalizationMode } from "./ActionRowBlock";

export interface Props {
  actions: T.Action[];
  blockTimestamp: number;
  detailsLink?: React.ReactNode;
  detalizationMode?: DetalizationMode;
  receiverId: string;
  signerId: string;
  showDetails?: boolean;
  viewMode?: ViewMode;
}

class ActionList extends PureComponent<Props> {
  render() {
    const {
      actions,
      blockTimestamp,
      signerId,
      receiverId,
      detailsLink,
      viewMode,
      detalizationMode,
      showDetails,
    } = this.props;

    let actionRows = actions.map((action, actionIndex) => (
      <ActionRow
        key={signerId + actionIndex}
        action={action}
        signerId={signerId}
        receiverId={receiverId}
        blockTimestamp={blockTimestamp}
        detailsLink={detailsLink}
        viewMode={viewMode}
        detalizationMode={detalizationMode}
        showDetails={showDetails}
      />
    ));

    return <>{actionRows}</>;
  }
}

export default ActionList;
