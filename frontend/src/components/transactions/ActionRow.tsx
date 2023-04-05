import * as React from "react";

import Image from "next/image";

import { Action } from "@explorer/common/types/procedures";
import actionIcons from "@explorer/frontend/components/transactions/ActionIcons";
import ActionMessage from "@explorer/frontend/components/transactions/ActionMessage";
import ActionRowBlock, {
  ViewMode,
  DetalizationMode,
} from "@explorer/frontend/components/transactions/ActionRowBlock";

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
    const actionIcon = actionIcons[action.kind];
    return (
      <ActionRowBlock
        viewMode={viewMode}
        detalizationMode={detalizationMode}
        signerId={signerId}
        blockTimestamp={blockTimestamp}
        detailsLink={detailsLink}
        icon={
          actionIcon ? (
            <Image
              {...actionIcon}
              width={viewMode === "compact" ? 12 : 16}
              height={viewMode === "compact" ? 12 : 16}
            />
          ) : null
        }
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
