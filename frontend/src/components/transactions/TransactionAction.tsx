import * as React from "react";

import TransactionLink from "../utils/TransactionLink";
import ActionGroup from "./ActionGroup";
import { ViewMode } from "./ActionRowBlock";
import TransactionExecutionStatus from "./TransactionExecutionStatus";

import { useTranslation } from "react-i18next";
import { TransactionBaseInfo } from "../../types/procedures";
import { useFetch } from "../../hooks/use-fetch";

export interface Props {
  transaction: TransactionBaseInfo;
  viewMode?: ViewMode;
}

const TransactionAction: React.FC<Props> = React.memo(
  ({ transaction, viewMode = "sparse" }) => {
    const { t } = useTranslation();
    const executionStatus = useFetch("transaction-execution-status", [
      transaction.hash,
      transaction.signerId,
    ]);

    if (!transaction.actions) {
      return null;
    }
    return (
      <ActionGroup
        actionGroup={transaction}
        detailsLink={<TransactionLink transactionHash={transaction.hash} />}
        status={
          executionStatus ? (
            <TransactionExecutionStatus status={executionStatus} />
          ) : (
            t("common.transactions.status.fetching_status")
          )
        }
        viewMode={viewMode}
        title={t("component.transactions.TransactionAction.batch_transaction")}
      />
    );
  }
);

export default TransactionAction;
