import BN from "bn.js";
import { useContext } from "react";

import { DatabaseContext } from "../../context/DatabaseProvider";
import {
  ExecutionStatus,
  Transaction,
} from "../../libraries/explorer-wamp/transactions";
import { ReceiptInfoProps } from "../blocks/Receipts";

import BatchTransactionIcon from "../../../public/static/images/icon-m-batch.svg";

import ActionRow from "./ActionRow";
import ActionRowBlock, { ViewMode } from "./ActionRowBlock";
import ActionsList from "./ActionsList";

interface Props {
  actionGroup: Transaction | ReceiptInfoProps;
  status?: ExecutionStatus;
  viewMode?: ViewMode;
  title: string;
  icon?: React.ReactElement;
}

const ActionGroup = ({ actionGroup, status, viewMode, title, icon }: Props) => {
  const { finalityStatus } = useContext(DatabaseContext);

  if (!actionGroup) return null;

  const isFinal =
    typeof finalityStatus?.finalBlockTimestampNanosecond !== "undefined"
      ? new BN(actionGroup.blockTimestamp).lte(
          finalityStatus.finalBlockTimestampNanosecond.divn(10 ** 6)
        )
      : undefined;

  // console.log("actionGroup", actionGroup);

  return (
    <>
      {actionGroup.actions.length !== 1 ? (
        <ActionRowBlock
          viewMode={viewMode}
          transaction={actionGroup}
          icon={icon ?? <BatchTransactionIcon />}
          title={title}
          status={status}
          isFinal={isFinal}
        >
          <ActionsList
            actions={actionGroup.actions}
            transaction={actionGroup}
            viewMode={viewMode}
            detalizationMode="minimal"
          />
        </ActionRowBlock>
      ) : (
        <ActionRow
          action={actionGroup.actions[0]}
          transaction={actionGroup}
          viewMode={viewMode}
          detalizationMode="detailed"
          status={status}
          isFinal={isFinal}
        />
      )}
    </>
  );
};

export default ActionGroup;
