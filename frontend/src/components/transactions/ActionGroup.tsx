import * as React from "react";

import BatchTransactionIcon from "../../../public/static/images/icon-m-batch.svg";

import ActionRow from "./ActionRow";
import ActionRowBlock, { ViewMode } from "./ActionRowBlock";
import ActionsList from "./ActionsList";
import { useSubscription } from "../../hooks/use-subscription";
import { Receipt, TransactionBaseInfo } from "../../types/common";

interface Props {
  actionGroup: Receipt | TransactionBaseInfo;
  detailsLink?: React.ReactNode;
  status?: React.ReactNode;
  viewMode?: ViewMode;
  title: string;
  icon?: React.ReactNode;
}

const ActionGroup: React.FC<Props> = React.memo(
  ({ actionGroup, detailsLink, status, viewMode, title, icon }) => {
    const latestBlockSub = useSubscription(["latestBlock"]);

    if (!actionGroup?.actions) return null;

    const isFinal =
      latestBlockSub.status === "success"
        ? actionGroup.blockTimestamp < latestBlockSub.data.timestamp
        : undefined;

    return (
      <>
        {actionGroup.actions.length !== 1 ? (
          <ActionRowBlock
            viewMode={viewMode}
            signerId={actionGroup.signerId}
            blockTimestamp={actionGroup.blockTimestamp}
            detailsLink={detailsLink}
            icon={icon ?? <BatchTransactionIcon />}
            title={title}
            status={status}
            isFinal={isFinal}
          >
            <ActionsList
              actions={actionGroup.actions}
              blockTimestamp={actionGroup.blockTimestamp}
              signerId={actionGroup.signerId}
              receiverId={actionGroup.receiverId}
              detailsLink={detailsLink}
              viewMode={viewMode}
              detalizationMode="minimal"
            />
          </ActionRowBlock>
        ) : (
          <ActionRow
            action={actionGroup.actions[0]}
            signerId={actionGroup.signerId}
            blockTimestamp={actionGroup.blockTimestamp}
            receiverId={actionGroup.receiverId}
            detailsLink={detailsLink}
            viewMode={viewMode}
            detalizationMode="detailed"
            status={status}
            isFinal={isFinal}
          />
        )}
      </>
    );
  }
);

export default ActionGroup;
