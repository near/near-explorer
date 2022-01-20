import { FC, useEffect, useState } from "react";
import TransactionsApi, * as T from "../../libraries/explorer-wamp/transactions";

import TransactionLink from "../utils/TransactionLink";
import ActionGroup from "./ActionGroup";
import { ViewMode } from "./ActionRowBlock";
import TransactionExecutionStatus from "./TransactionExecutionStatus";

import { useTranslation } from "react-i18next";

export interface Props {
  transaction: T.Transaction;
  viewMode?: ViewMode;
}

const TransactionAction: FC<Props> = ({ transaction, viewMode = "sparse" }) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState();
  useEffect(() => {
    new TransactionsApi()
      .getTransactionStatus(transaction.hash, transaction.signerId)
      .then(setStatus);
  }, [transaction.hash, transaction.signerId]);
  if (!transaction.actions) {
    return null;
  }
  return (
    <ActionGroup
      actionGroup={transaction as T.Transaction}
      detailsLink={<TransactionLink transactionHash={transaction.hash} />}
      status={
        status ? (
          <TransactionExecutionStatus status={status} />
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
