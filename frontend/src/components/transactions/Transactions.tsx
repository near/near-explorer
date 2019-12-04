import React from "react";

import TransactionsApi, * as T from "../../libraries/explorer-wamp/transactions";
import FlipMove from "react-flip-move";

import ActionRow, { ViewMode } from "../transactions/ActionRow";

export interface Props {
  accountId?: string;
  blockHash?: string;
  reversed: boolean;
  limit: number;
  viewMode?: ViewMode;
}

export interface State {
  transactions: T.Transaction[] | null;
}

export default class extends React.Component<Props, State> {
  static defaultProps = {
    reversed: true,
    limit: 50
  };

  state: State = {
    transactions: null
  };

  _transactionsApi: TransactionsApi | null;
  timer: any;

  constructor(props: Props) {
    super(props);

    // TODO: Design ExplorerApi to handle server-side rendering gracefully.
    this._transactionsApi = null;
    this.timer = 0;
  }

  componentDidMount() {
    this.regularFetchInfo();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    this.timer = null;
  }

  regularFetchInfo = async () => {
    await this.fetchTransactions();
    if (this.timer !== null) {
      this.timer = setTimeout(this.regularFetchInfo, 10000);
    }
  };

  fetchTransactions = async () => {
    if (this._transactionsApi === null) {
      this._transactionsApi = new TransactionsApi();
    }
    const transactions = await new TransactionsApi()
      .getLatestTransactionsInfo()
      .catch(() => null);
    this.setState({ transactions });
  };

  render() {
    const { transactions } = this.state;
    if (transactions === null) {
      return null;
    }
    let reserved = true;
    let actions = transactions.map(transaction =>
      transaction.actions.map((action, actionIndex) => (
        <ActionRow
          key={transaction.hash + actionIndex}
          action={action}
          transaction={transaction}
          viewMode="compact"
        />
      ))
    );

    if (reserved) {
      actions.reverse();
    }

    return (
      <FlipMove duration={1000} staggerDurationBy={0}>
        {actions}
      </FlipMove>
    );
  }
}
