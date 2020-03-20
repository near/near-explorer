// import moment from "moment";

// import React from "react";

// import { Row, Col } from "react-bootstrap";

// import TransactionsApi, * as T from "../../libraries/explorer-wamp/transactions";

// import CardCell from "../utils/CardCell";
// import TransactionLink from "../utils/TransactionLink";

interface Props {
  accountId: string;
}

interface State {
  display: boolean;
}

export default class extends React.Component<Props, State> {
  state: State = {
    display: false
  };

  checkTransactions = async () => {};

  render() {
    return <></>;
  }
}
