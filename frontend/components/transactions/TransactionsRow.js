import Link from "next/link";

import { Row, Col } from "react-bootstrap";

import { DataConsumer } from "../utils/DataProvider";
import Timer from "../utils/Timer";
import GetTransactionIcon from "../utils/GetTransactionIcon";

const TransactionsRow = props => (
  <Row
    className={`transaction-row mx-0 ${
      props.cls === undefined ? "" : props.cls
    }`}
  >
    <Col md="auto" xs="1" className="pr-0">
      {GetTransactionIcon[props.txn.txType]}
    </Col>
    <Col md="auto" xs="1" className="pr-0">
      <img
        src="/static/images/icon-arrow-right.svg"
        style={{ width: "10px" }}
      />
    </Col>
    <Col md="7" xs="6">
      <Row>
        <Col className="transaction-row-title">{props.txn.txMsg}</Col>
      </Row>
      <Row>
        <Col className="transaction-row-text">
          {props.txn.contractName} by {props.txn.username}
        </Col>
      </Row>
    </Col>
    <Col md="3" xs="4" className="ml-auto text-right">
      <Row>
        <Col className="transaction-row-txid">
          {props.txn.txId !== undefined
            ? `${props.txn.txId.substring(0, 7)}...`
            : null}
        </Col>
      </Row>
      <Row>
        <Col className="transaction-row-timer">
          <span className="transaction-row-timer-status">
            {props.txn.status}
          </span>
          &nbsp;&nbsp;
          <Timer time={props.txn.created} />
        </Col>
      </Row>
    </Col>
    <style jsx global>{`
      .transaction-row {
        padding-top: 10px;
        padding-bottom: 10px;
        border-top: solid 2px #f8f8f8;
      }

      .transaction-row-bottom {
        border-bottom: solid 2px #f8f8f8;
      }

      .transaction-row-title {
        font-family: BentonSans;
        font-size: 14px;
        font-weight: 500;
        line-height: 1.29;
        color: #24272a;
      }

      .transaction-row-text {
        font-family: BentonSans;
        font-size: 12px;
        font-weight: 500;
        line-height: 1.5;
        color: #999999;
      }

      .transaction-row-txid {
        font-family: BentonSans;
        font-size: 14px;
        font-weight: 500;
        line-height: 1.29;
        color: #0072ce;
      }

      .transaction-row-timer {
        font-family: BentonSans;
        font-size: 12px;
        color: #999999;
        font-weight: 100;
      }

      .transaction-row-timer-status {
        font-weight: 500;
      }
    `}</style>
  </Row>
);

export default TransactionsRow;
