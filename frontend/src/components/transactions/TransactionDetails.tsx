import { Row, Col } from "react-bootstrap";
import React from "react";

import BN from "bn.js";
import moment from "../../libraries/moment";

import AccountLink from "../utils/AccountLink";
import BlockLink from "../utils/BlockLink";
import CardCell from "../utils/CardCell";
import ExecutionStatus from "../utils/ExecutionStatus";
import Balance from "../utils/Balance";
import * as T from "../../libraries/explorer-wamp/transactions";

export interface Props {
  transaction: T.Transaction;
}

export interface State {
  deposit: BN;
  totalFee: BN;
  gasUsed: BN;
}

export default class extends React.Component<Props, State> {
  state: State = {
    deposit: new BN(0),
    totalFee: new BN(0),
    gasUsed: new BN(0)
  };

  setDeposit = () => {
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

  setTotalFee = () => {
    const price = new BN(this.props.transaction.gasPrice);
    const txFee = this.props.transaction.transactionOutcome
      ? new BN(this.props.transaction.transactionOutcome.outcome.gas_burnt)
      : new BN(0);
    const receiptFee = this.props.transaction.receiptsOutcome
      ? this.props.transaction.receiptsOutcome
          .map(receipt => new BN(receipt.outcome.gas_burnt))
          .reduce((gasBurnt, currentFee) => gasBurnt.add(currentFee), new BN(0))
      : new BN(0);
    const gasUsed = txFee.add(receiptFee);
    const totalFee = gasUsed.mul(price);
    this.setState({ totalFee, gasUsed });
  };

  componentDidMount() {
    this.setDeposit();
    this.setTotalFee();
  }

  render() {
    const { transaction } = this.props;
    const { deposit, totalFee, gasUsed } = this.state;
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
          <Col md="4">
            <CardCell
              title="Total Gas Cost"
              imgLink="/static/images/icon-m-size.svg"
              text={<Balance amount={totalFee.toString()} />}
              className="border-0"
            />
          </Col>
          <Col md="4">
            <CardCell
              title="Gas Used"
              imgLink="/static/images/icon-m-size.svg"
              text={gasUsed.toLocaleString()}
            />
          </Col>
          <Col md="4">
            <CardCell
              title="Gas Price"
              imgLink="/static/images/icon-m-filter.svg"
              text={
                <Balance amount={new BN(transaction.gasPrice).toString()} />
              }
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
