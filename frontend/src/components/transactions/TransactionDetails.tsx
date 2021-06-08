import BN from "bn.js";
import moment from "../../libraries/moment";

import { Row, Col } from "react-bootstrap";
import React from "react";

import { DatabaseConsumer } from "../../context/DatabaseProvider";
import * as T from "../../libraries/explorer-wamp/transactions";

import AccountLink from "../utils/AccountLink";
import BlockLink from "../utils/BlockLink";
import CardCell from "../utils/CardCell";
import Balance from "../utils/Balance";
import Gas from "../utils/Gas";
import Term from "../utils/Term";
import TransactionExecutionStatus from "./TransactionExecutionStatus";

export interface Props {
  transaction: T.Transaction;
}

export interface State {
  deposit?: BN;
  gasUsed?: BN;
  gasAttached?: BN;
  transactionFee?: BN;
}

class TransactionDetails extends React.Component<Props, State> {
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

  collectTransactionFee(transaction: T.Transaction): BN {
    const tokensBurntByTx = transaction.transactionOutcome
      ? new BN(transaction.transactionOutcome.outcome.tokens_burnt)
      : new BN(0);
    const tokensBurntByReceipts = transaction.receiptsOutcome
      ? transaction.receiptsOutcome
          .map((receipt) => new BN(receipt.outcome.tokens_burnt))
          .reduce(
            (tokenBurnt, currentFee) => tokenBurnt.add(currentFee),
            new BN(0)
          )
      : new BN(0);
    return tokensBurntByTx.add(tokensBurntByReceipts);
  }

  updateComputedValues = () => {
    const deposit = this.collectDeposit(this.props.transaction.actions);
    const gasUsed = this.collectGasUsed(this.props.transaction);
    const transactionFee = this.collectTransactionFee(this.props.transaction);
    let gasAttached = this.collectGasAttached(this.props.transaction.actions);
    if (gasAttached === null) {
      gasAttached = gasUsed;
    }
    const stateUpdate: State = {
      deposit,
      gasUsed,
      gasAttached,
      transactionFee,
    };
    this.setState(stateUpdate);
  };

  componentDidMount() {
    // NOTE: This will trigger the rest of the updates with componentDidUpdate
    this.updateComputedValues();
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.transaction.blockHash !== prevProps.transaction.blockHash) {
      this.updateComputedValues();
    }
  }

  render() {
    const { transaction } = this.props;
    const { deposit, transactionFee, gasUsed, gasAttached } = this.state;
    return (
      <DatabaseConsumer>
        {(context) => (
          <div className="transaction-info-container">
            <Row noGutters>
              <Col md="5">
                <CardCell
                  title={
                    <Term
                      title={"Signed by"}
                      text={"Account that signed and sent the transaction. "}
                      href={"https://docs.near.org/docs/concepts/account"}
                    />
                  }
                  imgLink="/static/images/icon-m-user.svg"
                  text={<AccountLink accountId={transaction.signerId} />}
                  className="border-0"
                />
              </Col>
              <Col md="4">
                <CardCell
                  title={
                    <Term
                      title={"Receiver"}
                      text={"Account receiving the transaction. "}
                      href={"https://docs.near.org/docs/concepts/account"}
                    />
                  }
                  imgLink="/static/images/icon-m-user.svg"
                  text={<AccountLink accountId={transaction.receiverId} />}
                />
              </Col>
              <Col md="3">
                <CardCell
                  title={
                    <Term
                      title={"Status"}
                      text={
                        "Current status of the transaction (Pending, Succeeded, Failed/Finalized or non finalized). "
                      }
                      href={"https://docs.near.org/docs/concepts/transaction"}
                    />
                  }
                  imgLink="/static/images/icon-t-status.svg"
                  text={
                    <div style={{ fontSize: "21px" }}>
                      {transaction.status ? (
                        <TransactionExecutionStatus
                          status={transaction.status}
                        />
                      ) : (
                        "Fetching Status... "
                      )}
                      {typeof context.finalityStatus
                        ?.finalBlockTimestampNanosecond === "undefined"
                        ? "/Checking Finality..."
                        : new BN(transaction.blockTimestamp).lte(
                            context.finalityStatus?.finalBlockTimestampNanosecond.divn(
                              10 ** 6
                            )
                          )
                        ? ""
                        : "/Finalizing"}
                    </div>
                  }
                />
              </Col>
            </Row>
            <Row noGutters>
              <Col md="3">
                <CardCell
                  title={
                    <Term
                      title={"Transaction Fee"}
                      text={
                        "Total fee paid in NEAR to execute this transaction. "
                      }
                      href={"https://docs.near.org/docs/concepts/transaction"}
                    />
                  }
                  imgLink="/static/images/icon-m-size.svg"
                  text={
                    transactionFee ? (
                      <Balance amount={transactionFee.toString()} />
                    ) : (
                      "..."
                    )
                  }
                  className="border-0"
                />
              </Col>
              <Col md="3">
                <CardCell
                  title={
                    <Term
                      title={"Deposit Value"}
                      text={`Sum of all NEAR tokens transferred from the Signing account to the Receiver account.
                            This includes tokens sent in a Transfer action(s), and as deposits on Function Call action(s). `}
                      href={
                        "https://near.org/papers/economics-in-sharded-blockchain/"
                      }
                    />
                  }
                  imgLink="/static/images/icon-m-filter.svg"
                  text={
                    deposit ? <Balance amount={deposit.toString()} /> : "..."
                  }
                />
              </Col>
              <Col md="3">
                <CardCell
                  title={
                    <Term
                      title={"Gas Used"}
                      text={
                        "Units of gas required to execute this transaction. "
                      }
                      href={"https://docs.near.org/docs/concepts/transaction"}
                    />
                  }
                  imgLink="/static/images/icon-m-size.svg"
                  text={gasUsed ? <Gas gas={gasUsed} /> : "..."}
                />
              </Col>
              <Col md="3">
                <CardCell
                  title={
                    <Term
                      title={"Attached Gas"}
                      text={
                        "Units of gas attached to the transaction (this is often higher than 'Gas Used'). "
                      }
                    />
                  }
                  imgLink="/static/images/icon-m-size.svg"
                  text={gasAttached ? <Gas gas={gasAttached} /> : "..."}
                />
              </Col>
            </Row>
            <Row noGutters className="border-0">
              <Col md="4">
                <CardCell
                  title={
                    <Term
                      title={"Created"}
                      text={
                        "Timestamp of when this transaction was submitted. "
                      }
                      href={"https://docs.near.org/docs/concepts/transaction"}
                    />
                  }
                  text={moment(transaction.blockTimestamp).format(
                    "MMMM DD, YYYY [at] h:mm:ssa"
                  )}
                  className="border-0"
                />
              </Col>
              <Col md="8">
                <CardCell
                  title={
                    <Term
                      title={"Hash"}
                      text={"Unique identifier (hash) of this transaction. "}
                      href={"https://docs.near.org/docs/concepts/transaction"}
                    />
                  }
                  text={transaction.hash}
                  className="border-0"
                />
              </Col>
            </Row>
            <Row noGutters>
              <Col md="12">
                <CardCell
                  title={
                    <Term
                      title={"Block Hash"}
                      text={
                        "Unique identifier (hash) of the block this transaction was included in. "
                      }
                    />
                  }
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
        )}
      </DatabaseConsumer>
    );
  }
}

export default TransactionDetails;
