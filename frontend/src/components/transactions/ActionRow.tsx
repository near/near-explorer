import * as React from "react";

import { Action } from "@/common/types/procedures";
import actionIcons from "@/frontend/components/transactions/ActionIcons";
import ActionMessage from "@/frontend/components/transactions/ActionMessage";
import ActionRowBlock, {
  ViewMode,
  DetalizationMode,
} from "@/frontend/components/transactions/ActionRowBlock";

export interface Props {
  action: Action;
  blockTimestamp?: number;
  detailsLink?: React.ReactNode;
  detalizationMode?: DetalizationMode;
  isFinal?: boolean;
  receiverId: string;
  signerId: string;
  showDetails?: boolean;
  status?: React.ReactNode;
  viewMode?: ViewMode;
}

const ActionRow: React.FC<Props> = React.memo(
  ({
    viewMode = "sparse",
    detalizationMode = "detailed",
    signerId,
    receiverId,
    blockTimestamp,
    detailsLink,
    action,
    showDetails,
    status,
    isFinal,
  }) => {
    const ActionIcon = actionIcons[action.kind];
    return (
      <ActionRowBlock
        viewMode={viewMode}
        detalizationMode={detalizationMode}
        signerId={signerId}
        blockTimestamp={blockTimestamp}
        detailsLink={detailsLink}
        icon={ActionIcon && <ActionIcon />}
        title={
          <ActionMessage
            receiverId={receiverId}
            action={action}
            showDetails={showDetails}
          />
        }
        status={status}
        isFinal={isFinal}
      />
    );
  }
);

export default ActionRow;
