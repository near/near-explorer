import * as React from "react";
import { Action } from "../../types/common";

import ActionRow from "./ActionRow";
import { ViewMode, DetalizationMode } from "./ActionRowBlock";

export interface Props {
  actions: Action[];
  blockTimestamp: number;
  detailsLink?: React.ReactNode;
  detalizationMode?: DetalizationMode;
  receiverId: string;
  signerId: string;
  showDetails?: boolean;
  viewMode?: ViewMode;
}

const ActionList: React.FC<Props> = React.memo(
  ({
    actions,
    blockTimestamp,
    signerId,
    receiverId,
    detailsLink,
    viewMode,
    detalizationMode,
    showDetails,
  }) => {
    return (
      <>
        {actions.map((action, actionIndex) => (
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
        ))}
      </>
    );
  }
);

export default ActionList;
