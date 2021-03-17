import BN from "bn.js";
import React from "react";
import { Row, Col } from "react-bootstrap";

import * as T from "../../libraries/explorer-wamp/transactions";
import Gas from "../utils/Gas";
import Balance from "../utils/Balance";

export interface Props {
  transaction: T.TransactionOutcome;
}

class TransactionOutcome extends React.Component<Props> {
  render() {
    const { transaction } = this.props;
    const gasBurnt = transaction?.outcome
      ? new BN(transaction.outcome.gas_burnt)
      : new BN(0);
    const tokensBurnt = transaction?.outcome
      ? new BN(transaction.outcome.tokens_burnt)
      : new BN(0);
    return (
      <Row noGutters className="transaction-outcome">
        <Col>
          <Row noGutters>
            <Col className="transaction-outcome-row-title main">
              <b>Convert Transaction To Receipt</b>
            </Col>
          </Row>

          <Row noGutters className="transaction-outcome-row mx-0 pl-4">
            <Col className="transaction-outcome-row-title">Gas Burned:</Col>
            <Col className="transaction-outcome-row-text">
              {gasBurnt ? <Gas gas={gasBurnt} /> : "..."}
            </Col>
          </Row>

          <Row noGutters className="transaction-outcome-row mx-0 pl-4">
            <Col className="transaction-outcome-row-title">Tokens Burned:</Col>
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
