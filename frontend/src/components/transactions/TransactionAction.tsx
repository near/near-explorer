import React from "react";
import * as T from "../../libraries/explorer-wamp/transactions";

import BatchTransactionIcon from "../../../public/static/images/icon-m-batch.svg";

import ActionRow from "./ActionRow";
import ActionRowBlock, { ViewMode } from "./ActionRowBlock";
import ActionsList from "./ActionsList";

export interface Props {
  actions: ({
    kind: string;
    args: T.Action[keyof T.Action];
  })[];
  transaction: T.Transaction;
  viewMode?: ViewMode;
  reversed?: boolean;
}

export default class extends React.Component<Props> {
  static defaultProps = {
    viewMode: "sparse",
    reversed: false
  };

  render() {
    const { transaction, viewMode, reversed } = this.props;

    if (this.props.actions.length !== 1) {
      return (
        <ActionRowBlock
          viewMode={viewMode}
          transaction={transaction}
          icon={<BatchTransactionIcon />}
          title={"Batch Transaction"}
        >
          <ActionsList
            actions={transaction.actions}
            transaction={transaction}
            viewMode={viewMode}
            detalizationMode="minimal"
            reversed={reversed}
          />
        </ActionRowBlock>
      );
    }

    return (
      <ActionRow
        action={transaction.actions[0]}
        transaction={transaction}
        viewMode={viewMode}
        detalizationMode="detailed"
      />
    );
  }
}
