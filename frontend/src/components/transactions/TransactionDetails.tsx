import BN from "bn.js";
import moment from "../../libraries/moment";

import { Row, Col } from "react-bootstrap";
import React from "react";

import * as T from "../../libraries/explorer-wamp/transactions";

import AccountLink from "../utils/AccountLink";
import BlockLink from "../utils/BlockLink";
import CardCell from "../utils/CardCell";
import ExecutionStatus from "../utils/ExecutionStatus";
import Balance from "../utils/Balance";
import Gas from "../utils/Gas";

export interface Props {
  transaction: T.Transaction;
}

export interface State {
  deposit: BN;
  transactionFee: BN;
  gasUsed: BN;
  gasAttached: BN;
}

export default class extends React.Component<Props, State> {
  state: State = {
    deposit: new BN(0),
    transactionFee: new BN(0),
    gasUsed: new BN(0),
    gasAttached: new BN(0)
  };

  collectDeposit = () => {
    const deposit = this.props.transaction.actions
      .map(action => {
        let actionArgs = action.args as any;
        if (actionArgs.hasOwnProperty("deposit")) {
          return new BN(actionArgs.deposit);
        } else {
          return new BN(0);
        }
      })
      .reduce((accumulator, deposit) => accumulator.add(deposit), new BN(0));
    this.setState({ deposit });
  };

  collectAttachedGas = () => {
    const gasAttached = this.props.transaction.actions
      .map(action => {
        let actionArgs = action.args as any;
        if (actionArgs.hasOwnProperty("gas")) {
          return new BN(actionArgs.gas);
        } else {
          return new BN(0);
        }
      })
      .reduce(
        (accumulator, currentgas) => accumulator.add(currentgas),
        new BN(0)
      );
    if (gasAttached.gt(new BN(0))) {
      return gasAttached;
    }
    return new BN(-1);
  };

  collectTotalFee = () => {
    const gasPrice = new BN(this.props.transaction.gasPrice);
    const gasBurntByTx = this.props.transaction.transactionOutcome
      ? new BN(this.props.transaction.transactionOutcome.outcome.gas_burnt)
      : new BN(0);
    const gasBurntByReceipts = this.props.transaction.receiptsOutcome
      ? this.props.transaction.receiptsOutcome
          .map(receipt => new BN(receipt.outcome.gas_burnt))
          .reduce((gasBurnt, currentFee) => gasBurnt.add(currentFee), new BN(0))
      : new BN(0);
    const gasUsed = gasBurntByTx.add(gasBurntByReceipts);
    const transactionFee = gasUsed.mul(gasPrice);
    let gasAttached = this.collectAttachedGas();
    if (gasAttached.lt(new BN(0))) {
      gasAttached = gasUsed;
    }
    this.setState({ transactionFee, gasUsed, gasAttached });
  };

  componentDidMount() {
    this.collectDeposit();
    this.collectTotalFee();
  }

  componentDidUpdate(preProps: Props) {
    if (this.props.transaction !== preProps.transaction) {
      this.collectDeposit();
      this.collectTotalFee();
    }
  }

  render() {
    const { transaction } = this.props;
    const { deposit, transactionFee, gasUsed, gasAttached } = this.state;
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
              text={<Balance amount={deposit.toString()} />}
            />
          </Col>
          <Col md="3">
            <CardCell
              title="Status"
              imgLink="/static/images/icon-t-status.svg"
              text={<ExecutionStatus status={transaction.status} />}
            />
          </Col>
        </Row>
        <Row noGutters>
          <Col md="3">
            <CardCell
              title="Total Gas Cost"
              imgLink="/static/images/icon-m-size.svg"
              text={<Balance amount={transactionFee.toString()} />}
              className="border-0"
            />
          </Col>
          <Col md="3">
            <CardCell
              title="Gas Price"
              imgLink="/static/images/icon-m-filter.svg"
              text={<Balance amount={transaction.gasPrice} />}
            />
          </Col>
          <Col md="3">
            <CardCell
              title="Gas Used"
              imgLink="/static/images/icon-m-size.svg"
              text={<Gas gas={gasUsed} />}
            />
          </Col>
          <Col md="3">
            <CardCell
              title="Attached Gas"
              imgLink="/static/images/icon-m-size.svg"
              text={<Gas gas={gasAttached} />}
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
