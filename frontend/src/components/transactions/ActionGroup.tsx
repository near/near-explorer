import BN from "bn.js";
import { useContext } from "react";

import { DatabaseContext } from "../../context/DatabaseProvider";
import { TransactionInfo } from "../../libraries/explorer-wamp/transactions";
import { DbReceiptInfo } from "../../libraries/explorer-wamp/receipts";

import BatchTransactionIcon from "../../../public/static/images/icon-m-batch.svg";

import ActionRow from "./ActionRow";
import ActionRowBlock, { ViewMode } from "./ActionRowBlock";
import ActionsList from "./ActionsList";

interface Props {
  actionGroup: DbReceiptInfo | TransactionInfo;
  actionLink?: React.ReactNode;
  status?: React.ReactNode;
  viewMode?: ViewMode;
  title: string;
  icon?: React.ReactElement;
}

const ActionGroup = ({
  actionGroup,
  actionLink,
  status,
  viewMode,
  title,
  icon,
}: Props) => {
  const { finalityStatus } = useContext(DatabaseContext);

  if (!actionGroup?.actions) return null;

  const isFinal =
    typeof finalityStatus?.finalBlockTimestampNanosecond !== "undefined"
      ? new BN(actionGroup.blockTimestamp).lte(
          finalityStatus.finalBlockTimestampNanosecond.divn(10 ** 6)
        )
      : undefined;

  return (
    <>
      {actionGroup.actions.length !== 1 ? (
        <ActionRowBlock
          viewMode={viewMode}
          actionBlock={actionGroup}
          actionLink={actionLink}
          icon={icon ?? <BatchTransactionIcon />}
          title={title}
          status={status}
          isFinal={isFinal}
        >
          <ActionsList
            actions={actionGroup.actions}
            actionBlock={actionGroup}
            actionLink={actionLink}
            viewMode={viewMode}
            detalizationMode="minimal"
          />
        </ActionRowBlock>
      ) : (
        <ActionRow
          action={actionGroup.actions[0]}
          actionBlock={actionGroup}
          actionLink={actionLink}
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
