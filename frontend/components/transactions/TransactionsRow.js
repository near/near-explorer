import Link from "next/link";

import { Row, Col } from "react-bootstrap";

import { DataConsumer } from "../utils/DataProvider";
import Timer from "../utils/Timer";
import transactionIcons from "./TransactionIcons";

import TransactionMessage from "./TransactionMessage";

const TransactionsRow = props => {
  const TransactionIcon = transactionIcons[props.txn.kind];
  const viewMode = props.viewMode || "sparse";
  return (
    <Row
      noGutters="true"
      className={`transaction-${viewMode}-row mx-0 ${
        props.className === undefined ? "" : props.className
      }`}
    >
      {viewMode === "compact" ? (
        <Col xs="1" className="transactions-icon-col">
          <div className="transaction-row-img">
            {TransactionIcon && <TransactionIcon />}
          </div>
        </Col>
      ) : (
        <>
          <Col md="auto" xs="1" className="pr-0">
            {TransactionIcon}
          </Col>
          <Col md="auto" xs="1" className="pr-0">
            <img
              src="/static/images/icon-arrow-right.svg"
              style={{ width: "10px" }}
            />
          </Col>
        </>
      )}
      <Col md="11" xs="11" className="transaction-row-details">
        <Row noGutters="true">
          <Col md="8" xs="7">
            <Row noGutters="true">
              <Col className="transaction-row-title">
                <TransactionMessage txn={props.txn} />
              </Col>
            </Row>
            <Row noGutters="true">
              <Col className="transaction-row-text">
                by @{props.txn.originator}
              </Col>
            </Row>
          </Col>
          <Col md="4" xs="5" className="ml-auto text-right">
            <Row>
              <Col className="transaction-row-txid">
                {props.txn.hash !== undefined
                  ? `${props.txn.hash.substring(0, 7)}...`
                  : null}
              </Col>
            </Row>
            <Row>
              <Col className="transaction-row-timer">
                <span className="transaction-row-timer-status">
                  {props.txn.status}
                </span>
                &nbsp;&nbsp;
                <Timer time={props.txn.blockTimestamp} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <style jsx global>{`
        .transaction-sparse-row {
          padding-top: 10px;
          padding-bottom: 10px;
          border-top: solid 2px #f8f8f8;
        }

        .transaction-compact-row .transaction-row-details {
          border-bottom: 2px solid #f8f8f8;
          margin-bottom: 15px;
          padding-bottom: 8px;
        }

        .transaction-row-img {
          width: 24px;
          height: 24px;
          border: solid 2px #f8f8f8;
          background-color: #ffffff;
          border-radius: 50%;
          margin-right: 8px;
          text-align: center;
          line-height: 1.1;
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
};

export default TransactionsRow;
