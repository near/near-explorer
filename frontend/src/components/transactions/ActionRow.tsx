import { FC } from "react";
import { Action, RpcAction } from "../../libraries/wamp/types";

import actionIcons from "./ActionIcons";
import ActionMessage from "./ActionMessage";
import ActionRowBlock, { ViewMode, DetalizationMode } from "./ActionRowBlock";

export interface Props {
  action: Action<keyof RpcAction>;
  blockTimestamp?: number;
  className?: string;
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
  className,
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
      className={className}
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
