import * as React from "react";

import { Action } from "@/common/types/procedures";
import ActionRow from "@/frontend/components/transactions/ActionRow";
import {
  ViewMode,
  DetalizationMode,
} from "@/frontend/components/transactions/ActionRowBlock";

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
  }) => (
    <>
      {actions.map((action, actionIndex) => (
        <ActionRow
          // eslint-disable-next-line react/no-array-index-key
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
  )
);

export default ActionList;
