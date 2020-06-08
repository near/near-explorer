import React from "react";
import { Row } from "react-bootstrap";
import TransactionsApi, * as T from "../../libraries/explorer-wamp/transactions";

import BatchTransactionIcon from "../../../public/static/images/icon-m-batch.svg";

import ActionRow from "./ActionRow";
import ActionRowBlock, { ViewMode } from "./ActionRowBlock";
import ActionsList from "./ActionsList";

export interface Props {
  transaction: T.Transaction;
  viewMode?: ViewMode;
}

interface State {
  transaction: T.Transaction;
}

export default class extends React.Component<Props, State> {
  static defaultProps = {
    viewMode: "sparse",
  };

  state: State = {
    transaction: this.props.transaction,
  };

  componentDidMount() {
    new TransactionsApi()
      .getTransactionStatus(this.props.transaction)
      .then((transaction) => this.setState({ transaction }));
  }

  render() {
    const { viewMode } = this.props;
    const { transaction } = this.state;
    if (transaction.actions) {
      if (transaction.actions.length !== 1) {
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
    return (
      <Row noGutters className={`action-${viewMode}-row mx-0 `}>
        <Row noGutters className="action-row-message">
          No action found
        </Row>
      </Row>
    );
  }
}
