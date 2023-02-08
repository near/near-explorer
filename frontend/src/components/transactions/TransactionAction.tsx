import * as React from "react";

import TransactionLink from "@explorer/frontend/components/utils/TransactionLink";
import ActionGroup from "@explorer/frontend/components/transactions/ActionGroup";
import { ViewMode } from "@explorer/frontend/components/transactions/ActionRowBlock";
import TransactionExecutionStatus from "@explorer/frontend/components/transactions/TransactionExecutionStatus";

import { useTranslation } from "react-i18next";
import { TransactionPreview } from "@explorer/common/types/procedures";

export interface Props {
  transaction: TransactionPreview;
  viewMode?: ViewMode;
}

const TransactionAction: React.FC<Props> = React.memo(
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

export default TransactionAction;
