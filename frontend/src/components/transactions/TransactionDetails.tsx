import BN from "bn.js";
import moment from "../../libraries/moment";

import { Row, Col } from "react-bootstrap";
import React from "react";

import BlocksApi, * as B from "../../libraries/explorer-wamp/blocks";
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
  block?: B.BlockInfo;
  deposit?: BN;
  gasUsed?: BN;
  gasAttached?: BN;
  transactionFee?: BN;
}

export default class extends React.Component<Props, State> {
  state: State = {};

  collectDeposit(actions: T.Action[]): BN {
    return actions
      .map((action) => {
        let actionArgs = action.args as any;
        if (actionArgs.hasOwnProperty("deposit")) {
          return new BN(actionArgs.deposit);
        } else {
          return new BN(0);
        }
      })
      .reduce((accumulator, deposit) => accumulator.add(deposit), new BN(0));
  }

  collectGasAttached(actions: T.Action[]): BN | null {
    const gasAttachedActions = actions.filter((action) => {
      return action.args.hasOwnProperty("gas");
    });
    if (gasAttachedActions.length === 0) {
      return null;
    }
    return gasAttachedActions.reduce(
      (accumulator, action) =>
        accumulator.add(new BN((action.args as any).gas.toString())),
      new BN(0)
    );
  }

  collectGasUsed(transaction: T.Transaction): BN {
    const gasBurntByTx = transaction.transactionOutcome
      ? new BN(transaction.transactionOutcome.outcome.gas_burnt)
      : new BN(0);
    const gasBurntByReceipts = transaction.receiptsOutcome
      ? transaction.receiptsOutcome
          .map((receipt) => new BN(receipt.outcome.gas_burnt))
          .reduce((gasBurnt, currentFee) => gasBurnt.add(currentFee), new BN(0))
      : new BN(0);
    return gasBurntByTx.add(gasBurntByReceipts);
  }

  updateBlock = async () => {
    const block = await new BlocksApi().getBlockInfo(
      this.props.transaction.blockHash
    );
    this.setState({ block });
  };

  updateComputedValues = () => {
    const deposit = this.collectDeposit(this.props.transaction.actions);
    const gasUsed = this.collectGasUsed(this.props.transaction);
    let gasAttached = this.collectGasAttached(this.props.transaction.actions);
    if (gasAttached === null) {
      gasAttached = gasUsed;
    }
    const stateUpdate: State = { deposit, gasUsed, gasAttached };
    if (this.state.block) {
      stateUpdate.transactionFee = gasUsed.mul(
        new BN(this.state.block.gasPrice)
      );
    }
    this.setState(stateUpdate);
  };

  componentDidMount() {
    // NOTE: This will trigger the rest of the updates with componentDidUpdate
    this.updateComputedValues();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state.block === undefined) {
      this.updateBlock();
    } else if (this.state.block.hash !== this.props.transaction.blockHash) {
      if (this.state.transactionFee) {
        this.setState({
          deposit: undefined,
          gasUsed: undefined,
          gasAttached: undefined,
          transactionFee: undefined,
        });
      } else {
        this.updateBlock();
      }
    } else if (
      !prevState.block ||
      this.state.block.hash !== prevState.block.hash ||
      this.props.transaction !== prevProps.transaction ||
      this.props.transaction.blockHash !== prevProps.transaction.blockHash
    ) {
      this.updateComputedValues();
    }
  }

  render() {
    const { transaction } = this.props;
    const { block, deposit, transactionFee, gasUsed, gasAttached } = this.state;
    return (
      <div className="transaction-info-container">
        <Row noGutters>
          <Col md="3">
            <CardCell
              title="Signed by"
              imgLink="/static/images/icon-m-user.svg"
              text={<AccountLink accountId={transaction.signerId} />}
              className="border-0"
              termDescription={"Account that signed and sent the transaction."}
              href={"https://docs.nearprotocol.com/docs/concepts/account"}
            />
          </Col>
          <Col md="3">
            <CardCell
              title="Receiver"
              imgLink="/static/images/icon-m-user.svg"
              text={<AccountLink accountId={transaction.receiverId} />}
              termDescription={"Account receiving the transaction."}
              href={"https://docs.nearprotocol.com/docs/concepts/account"}
            />
          </Col>
          <Col md="3">
            <CardCell
              title="Value"
              imgLink="/static/images/icon-m-filter.svg"
              text={deposit ? <Balance amount={deposit.toString()} /> : "..."}
              termDescription={`Sum of all NEAR tokens transferred from the Signing account to the Receiver account. 
                This includes tokens sent in a Transfer action(s), and as deposits on Function Call action(s).`}
              href={
                "https://nearprotocol.com/papers/economics-in-sharded-blockchain/"
              }
            />
          </Col>
          <Col md="3">
            <CardCell
              title="Status"
              imgLink="/static/images/icon-t-status.svg"
              text={<ExecutionStatus status={transaction.status} />}
              termDescription={
                "Current status of the transaction (Pending, Succeeded, Failed)."
              }
              href={"https://docs.nearprotocol.com/docs/concepts/transaction"}
            />
          </Col>
        </Row>
        <Row noGutters>
          <Col md="3">
            <CardCell
              title="Transaction Fee"
              imgLink="/static/images/icon-m-size.svg"
              text={
                transactionFee ? (
                  <Balance amount={transactionFee.toString()} />
                ) : (
                  "..."
                )
              }
              className="border-0"
              termDescription={
                "Total fee paid in NEAR to execute this transaction."
              }
              href={"https://docs.nearprotocol.com/docs/concepts/transaction"}
            />
          </Col>
          <Col md="3">
            <CardCell
              title="Gas Price"
              imgLink="/static/images/icon-m-filter.svg"
              text={block ? <Balance amount={block.gasPrice} /> : "..."}
              termDescription={"Cost per unit of gas."}
              href={"https://docs.nearprotocol.com/docs/concepts/transaction"}
            />
          </Col>
          <Col md="3">
            <CardCell
              title="Gas Used"
              imgLink="/static/images/icon-m-size.svg"
              text={gasUsed ? <Gas gas={gasUsed} /> : "..."}
              termDescription={
                "Units of gas required to execute this transaction."
              }
              href={"https://docs.nearprotocol.com/docs/concepts/transaction"}
            />
          </Col>
          <Col md="3">
            <CardCell
              title="Attached Gas"
              imgLink="/static/images/icon-m-size.svg"
              text={gasAttached ? <Gas gas={gasAttached} /> : "..."}
              termDescription={
                "Units of gas attached to the transaction (this is often higher than 'Gas Used')."
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
              termDescription={
                "Timestamp of when this transaction was submitted."
              }
              href={"https://docs.nearprotocol.com/docs/concepts/transaction"}
            />
          </Col>
          <Col md="8">
            <CardCell
              title="Hash"
              text={transaction.hash}
              className="border-0"
              termDescription={"Unique identifier (hash) of this transaction."}
              href={"https://docs.nearprotocol.com/docs/concepts/transaction"}
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
              termDescription={
                "Unique identifier (hash) of the block this transaction was included in."
              }
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
