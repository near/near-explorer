import BN from "bn.js";
import { Component } from "react";
import { Row, Col } from "react-bootstrap";

import * as T from "../../libraries/explorer-wamp/transactions";
import Gas from "../utils/Gas";
import Balance from "../utils/Balance";

import { Translate } from "react-localize-redux";

export interface Props {
  transaction: T.TransactionOutcome;
}

class TransactionOutcome extends Component<Props> {
  render() {
    const { transaction } = this.props;
    const gasBurnt = new BN(transaction.outcome?.gas_burnt ?? 0);
    const tokensBurnt = new BN(transaction.outcome?.tokens_burnt ?? 0);
    return (
      <Row noGutters className="transaction-outcome">
        <Col>
          <Row noGutters>
            <Col className="transaction-outcome-row-title main">
              <b>
                <Translate id="common.transactions.execution.convert_transaction_to_receipt" />
              </b>
            </Col>
          </Row>

          <Row noGutters className="transaction-outcome-row mx-0 pl-4">
            <Col className="transaction-outcome-row-title">
              <Translate id="common.transactions.execution.gas_burned" />:
            </Col>
            <Col className="transaction-outcome-row-text">
              {gasBurnt ? <Gas gas={gasBurnt} /> : "..."}
            </Col>
          </Row>

          <Row noGutters className="transaction-outcome-row mx-0 pl-4">
            <Col className="transaction-outcome-row-title">
              <Translate id="common.transactions.execution.tokens_burned" />:
            </Col>
            <Col className="transaction-outcome-row-text">
              {tokensBurnt ? (
                <Balance amount={tokensBurnt.toString()} />
              ) : (
                "..."
              )}
            </Col>
          </Row>
        </Col>
        <style jsx global>{`
          .transaction-outcome-row {
            padding-top: 10px;
            border-left: 2px solid #e5e5e5;
          }

          .transaction-outcome-row-title.main {
            padding-bottom: 10px;
          }

          .transaction-outcome-row-title {
            font-size: 14px;
            line-height: 1.29;
            color: #24272a;
          }

          .transaction-outcome-row-text {
            font-size: 14px;
            font-weight: 500;
            line-height: 1.29;
          }
        `}</style>
      </Row>
    );
  }
}

export default TransactionOutcome;
