import { Row, Col } from "react-bootstrap";
import React from "react";

import { Transaction } from "../../libraries/explorer-wamp/transactions";
import moment from "../../libraries/moment";

import AccountLink from "../utils/AccountLink";
import BlockLink from "../utils/BlockLink";
import CardCell from "../utils/CardCell";
import ExecutionStatus from "../utils/ExecutionStatus";
import Balance from "../utils/Balance";
import * as T from "../../libraries/explorer-wamp/transactions";

const Big = require("big.js");

export interface Props {
  transaction: Transaction;
}

export interface State {
  deposit: string;
}

export default class extends React.Component<Props, State> {
  state: State = {
    deposit: "0"
  };

  componentDidMount() {
    const deposits = this.props.transaction.actions.map(action => {
      let actionKind: keyof T.Action;
      let actionArgs: any;
      if (typeof action === "string") {
        actionKind = action;
        actionArgs = {};
      } else {
        actionKind = Object.keys(action)[0] as keyof T.Action;
        actionArgs = action[actionKind];
      }
      if (actionArgs.hasOwnProperty("deposit")) {
        return actionArgs.deposit;
      } else {
        return "0";
      }
    });
    const IntLengths: Array<number> = deposits.map(dp => dp.length);
    const max = Math.max(...IntLengths);
    const bigIntDeposit = deposits
      .map(dp => new Big(dp))
      .reduce((current, dp) => dp.plus(current), 0)
      .c.join("");
    if (bigIntDeposit.length < max) {
      const tail = "0".repeat(max - bigIntDeposit.length);
      const deposit = bigIntDeposit.concat(tail);
      this.setState({ deposit });
    } else {
      this.setState({ deposit: bigIntDeposit });
    }
  }

  render() {
    const { transaction } = this.props;
    const { deposit } = this.state;
    return (
      <div className="transaction-info-container">
        <Row noGutters>
          <Col md="3">
            <CardCell
              title="Signed by"
              imgLink="/static/images/icon-m-user.svg"
              text={<AccountLink accountId={transaction.signerId} />}
              className="border-0"
            />
          </Col>
          <Col md="3">
            <CardCell
              title="Receiver"
              imgLink="/static/images/icon-m-user.svg"
              text={<AccountLink accountId={transaction.receiverId} />}
            />
          </Col>
          <Col md="3">
            <CardCell
              title="Value"
              imgLink="/static/images/icon-m-filter.svg"
              text={<Balance amount={deposit} />}
            />
          </Col>
          <Col md="3">
            <CardCell
              title="Status"
              imgLink="/static/images/icon-m-filter.svg"
              text={<ExecutionStatus status={transaction.status} />}
            />
          </Col>
        </Row>
        <Row noGutters className="border-0">
          <Col md="4">
            <CardCell
              title="Created"
              text={moment(transaction.blockTimestamp).format(
                "MMMM DD, YYYY [at] h:mm:ssa"
              )}
              className="border-0"
            />
          </Col>
          <Col md="8">
            <CardCell
              title="Hash"
              text={transaction.hash}
              className="border-0"
            />
          </Col>
        </Row>
        <Row noGutters>
          <Col md="12">
            <CardCell
              title="Block Hash"
              text={
                <BlockLink blockHash={transaction.blockHash}>
                  {transaction.blockHash}
                </BlockLink>
              }
              className="transaction-card-block-hash border-0"
            />
          </Col>
        </Row>
        <style jsx global>{`
          .transaction-info-container {
            border: solid 4px #e6e6e6;
            border-radius: 4px;
          }

          .transaction-info-container > .row {
            border-bottom: 2px solid #e6e6e6;
          }

          .transaction-info-container > .row:last-of-type {
            border-bottom: 0;
          }

          .transaction-info-container > .row:first-of-type .card-cell-text {
            font-size: 24px;
          }

          .transaction-card-block-hash {
            background-color: #f8f8f8;
          }
        `}</style>
      </div>
    );
  }
}
