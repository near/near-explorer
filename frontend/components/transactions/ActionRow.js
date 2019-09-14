import Link from "next/link";

import { Row, Col } from "react-bootstrap";

import { DataConsumer } from "../utils/DataProvider";
import Timer from "../utils/Timer";
import actionIcons from "./ActionIcons";

import ActionMessage from "./ActionMessage";

const ActionRow = props => {
  const { transaction, action } = props;
  let actionKind, actionArgs;
  if (typeof action === "string") {
    actionKind = action;
    actionArgs = {};
  } else {
    actionKind = Object.keys(action)[0];
    actionArgs = action[actionKind];
  }
  const ActionIcon = actionIcons[actionKind];
  const viewMode = props.viewMode || "sparse";
  return (
    <Row
      noGutters="true"
      className={`action-${viewMode}-row mx-0 ${
        props.className === undefined ? "" : props.className
      }`}
    >
      {viewMode === "compact" ? (
        <Col xs="1" className="actions-icon-col">
          <div className="action-row-img">{ActionIcon && <ActionIcon />}</div>
        </Col>
      ) : (
        <>
          <Col md="auto" xs="1" className="pr-0">
            {ActionIcon}
          </Col>
          <Col md="auto" xs="1" className="pr-0">
            <img
              src="/static/images/icon-arrow-right.svg"
              style={{ width: "10px" }}
            />
          </Col>
        </>
      )}
      <Col md="11" xs="11" className="action-row-details">
        <Row noGutters="true">
          <Col md="8" xs="7">
            <Row noGutters="true">
              <Col className="action-row-title">
                <ActionMessage
                  transaction={transaction}
                  actionKind={actionKind}
                  actionArgs={actionArgs}
                />
              </Col>
            </Row>
            <Row noGutters="true">
              <Col className="action-row-text">by @{transaction.signerId}</Col>
            </Row>
          </Col>
          <Col md="4" xs="5" className="ml-auto text-right">
            <Row>
              <Col className="action-row-txid">
                {transaction.hash !== undefined
                  ? `${transaction.hash.substring(0, 7)}...`
                  : null}
              </Col>
            </Row>
            <Row>
              <Col className="action-row-timer">
                <span className="action-row-timer-status">
                  {transaction.status}
                </span>
                &nbsp;&nbsp;
                <Timer time={transaction.blockTimestamp} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <style jsx global>{`
        .action-sparse-row {
          padding-top: 10px;
          padding-bottom: 10px;
          border-top: solid 2px #f8f8f8;
        }

        .action-compact-row .action-row-details {
          border-bottom: 2px solid #f8f8f8;
          margin-bottom: 15px;
          padding-bottom: 8px;
        }

        .action-row-img {
          width: 24px;
          height: 24px;
          border: solid 2px #f8f8f8;
          background-color: #ffffff;
          border-radius: 50%;
          margin-right: 8px;
          text-align: center;
          line-height: 1.1;
        }

        .action-row-bottom {
          border-bottom: solid 2px #f8f8f8;
        }

        .action-row-title {
          font-family: BentonSans;
          font-size: 14px;
          font-weight: 500;
          line-height: 1.29;
          color: #24272a;
        }

        .action-row-text {
          font-family: BentonSans;
          font-size: 12px;
          font-weight: 500;
          line-height: 1.5;
          color: #999999;
        }

        .action-row-txid {
          font-family: BentonSans;
          font-size: 14px;
          font-weight: 500;
          line-height: 1.29;
          color: #0072ce;
        }

        .action-row-timer {
          font-family: BentonSans;
          font-size: 12px;
          color: #999999;
          font-weight: 100;
        }

        .action-row-timer-status {
          font-weight: 500;
        }
      `}</style>
    </Row>
  );
};

export default ActionRow;
