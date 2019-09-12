import Link from "next/link";

import { Row, Col } from "react-bootstrap";

import { DataConsumer } from "../utils/DataProvider";
import Timer from "../utils/Timer";

const BlocksRow = props => (
  <Link href="/blocks/[hash]" as={`/blocks/${props.block.hash}`}>
    <a style={{ textDecoration: "none" }}>
      <Row
        className={`transaction-row mx-0 ${
          props.cls === undefined ? "" : props.cls
        }`}
      >
        <Col md="auto" xs="1" className="pr-0">
          <img src="/static/images/icon-m-block.svg" />
        </Col>
        <Col md="auto" xs="1" className="pr-0">
          <img
            src="/static/images/icon-m-block.svg"
            style={{ width: "20px" }}
          />
        </Col>
        <Col md="7" xs="6">
          <Row>
            <Col className="transaction-row-title">#{props.block.height}</Col>
          </Row>
          <Row>
            <Col className="transaction-row-text">
              <Row>
                <Col md="auto">
                  <img
                    src="/static/images/icon-m-transaction.svg"
                    style={{ width: "12px" }}
                  />
                  {` ${props.block.transactionsCount}`}
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col md="3" xs="4" className="ml-auto text-right">
          <Row>
            <Col className="transaction-row-txid">
              {props.block.hash !== undefined
                ? `${props.block.hash.substring(0, 7)}...`
                : null}
            </Col>
          </Row>
          <Row>
            <Col className="transaction-row-timer">
              <span className="transaction-row-timer-status">Completed</span>
              &nbsp;&nbsp;
              <Timer time={props.block.timestamp} />
            </Col>
          </Row>
        </Col>
        <style jsx global>{`
          .transaction-row {
            padding-top: 10px;
            padding-bottom: 10px;
            border-top: solid 2px #f8f8f8;
          }

          .transaction-row:hover {
            background: rgba(0, 0, 0, 0.1);
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
    </a>
  </Link>
);

export default BlocksRow;
