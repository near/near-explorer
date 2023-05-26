import * as React from "react";

import { useTranslation } from "next-i18next";

import { TransactionPreview } from "@/common/types/procedures";
import { ActionGroup } from "@/frontend/components/transactions/ActionGroup";
import { ViewMode } from "@/frontend/components/transactions/ActionRowBlock";
import { TransactionExecutionStatus } from "@/frontend/components/transactions/TransactionExecutionStatus";
import { TransactionLink } from "@/frontend/components/utils/TransactionLink";

export interface Props {
  transaction: TransactionPreview;
  viewMode?: ViewMode;
}

export const TransactionAction: React.FC<Props> = React.memo(
  ({ transaction, viewMode = "sparse" }) => {
    const { t } = useTranslation();

    if (!transaction.actions) {
      return null;
    }
    return (
      <ActionGroup
        actionGroup={transaction}
        detailsLink={<TransactionLink transactionHash={transaction.hash} />}
        status={<TransactionExecutionStatus status={transaction.status} />}
        viewMode={viewMode}
        title={t("component.transactions.TransactionAction.batch_transaction")}
      />
    );
  }
);
