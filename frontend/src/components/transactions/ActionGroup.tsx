import * as React from "react";

import Image from "next/image";

import { Receipt, TransactionPreview } from "@explorer/common/types/procedures";
import ActionRow from "@explorer/frontend/components/transactions/ActionRow";
import ActionRowBlock, {
  ViewMode,
} from "@explorer/frontend/components/transactions/ActionRowBlock";
import ActionsList from "@explorer/frontend/components/transactions/ActionsList";
import { useSubscription } from "@explorer/frontend/hooks/use-subscription";
import batchTransactionIcon from "@explorer/frontend/public/static/images/icon-m-batch.svg";

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
            icon={icon ? <Image {...batchTransactionIcon} /> : null}
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
