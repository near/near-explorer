import * as React from "react";

import TransactionLink from "../utils/TransactionLink";
import ActionGroup from "./ActionGroup";
import { ViewMode } from "./ActionRowBlock";
import TransactionExecutionStatus from "./TransactionExecutionStatus";

import { useTranslation } from "react-i18next";
import { TransactionPreview } from "../../types/common";

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
