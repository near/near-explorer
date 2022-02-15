import { FC } from "react";
import { Action } from "../../libraries/wamp/types";

import actionIcons from "./ActionIcons";
import ActionMessage from "./ActionMessage";
import ActionRowBlock, { ViewMode, DetalizationMode } from "./ActionRowBlock";

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

const ActionRow: FC<Props> = ({
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
          actionKind={action.kind}
          actionArgs={action.args}
          showDetails={showDetails}
        />
      }
      status={status}
      isFinal={isFinal}
    />
  );
};

export default ActionRow;
