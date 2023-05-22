import * as React from "react";

import { Receipt, TransactionPreview } from "@/common/types/procedures";
import ActionRow from "@/frontend/components/transactions/ActionRow";
import ActionRowBlock, {
  ViewMode,
} from "@/frontend/components/transactions/ActionRowBlock";
import ActionsList from "@/frontend/components/transactions/ActionsList";
import { subscriptions } from "@/frontend/hooks/use-subscription";
import BatchTransactionIcon from "@/frontend/public/static/images/icon-m-batch.svg";

interface Props {
  actionGroup: Receipt | TransactionPreview;
  detailsLink?: React.ReactNode;
  status?: React.ReactNode;
  viewMode?: ViewMode;
  title: string;
  icon?: React.ReactNode;
}

const ActionGroup: React.FC<Props> = React.memo(
  ({ actionGroup, detailsLink, status, viewMode, title, icon }) => {
    const latestBlockSub = subscriptions.latestBlock.useSubscription();

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
