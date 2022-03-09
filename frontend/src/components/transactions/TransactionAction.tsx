import * as React from "react";

import TransactionLink from "../utils/TransactionLink";
import ActionGroup from "./ActionGroup";
import { ViewMode } from "./ActionRowBlock";
import TransactionExecutionStatus from "./TransactionExecutionStatus";

import { useTranslation } from "react-i18next";
import {
  ExecutionStatus,
  TransactionBaseInfo,
} from "../../libraries/wamp/types";
import { useWampQuery } from "../../hooks/wamp";

export interface Props {
  transaction: TransactionBaseInfo;
  viewMode?: ViewMode;
}

const TransactionAction: React.FC<Props> = ({
  transaction,
  viewMode = "sparse",
}) => {
  const { t } = useTranslation();
  const executionStatus = useWampQuery(
    React.useCallback(
      async (wampCall) => {
        // TODO: Expose transaction status via transactions list from chunk
        // RPC, and store it during Explorer synchronization.
        //
        // Meanwhile, we query this information in a non-effective manner,
        // that is making a separate query per transaction to nearcore RPC.
        const transactionExtraInfo = await wampCall("nearcore-tx", [
          transaction.hash,
          transaction.signerId,
        ]);
        return Object.keys(transactionExtraInfo.status)[0] as ExecutionStatus;
      },
      [transaction.hash, transaction.signerId]
    )
  );

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
};

export default TransactionAction;
