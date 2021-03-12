import React from "react";
import { Row, Col } from "react-bootstrap";

import * as T from "../../libraries/explorer-wamp/transactions";

import { displayArgs } from "./ActionMessage";

export interface Props {
  sirReceiptHash: string;
  receiptsObj: {};
  receiptsInfoObj: {};
  senderIsReceiverActions: T.RpcAction[];
  senderIsReceiver: Boolean;
}

export default class extends React.Component<Props> {
  handleStatusInfo = function (receipt: T.ReceiptLocalOutcome) {
    let statusInfo;
    if ("SuccessValue" in (receipt.outcome.status as T.ReceiptSuccessValue)) {
      const { SuccessValue } = receipt.outcome.status as T.ReceiptSuccessValue;
      if (SuccessValue === null) {
        statusInfo = "No result";
      } else if (SuccessValue.length === 0) {
        statusInfo = "Empty result";
      } else {
        statusInfo = (
          <>
            <i>Result: </i>
            {displayArgs(SuccessValue)}
          </>
        );
      }
    } else if ("Failure" in (receipt.outcome.status as T.ReceiptFailure)) {
      const { Failure } = receipt.outcome.status as T.ReceiptFailure;
      statusInfo = (
        <>
          <i>Failure: </i>
          <pre>{JSON.stringify(Failure, null, 2)}</pre>
        </>
      );
    } else if (
      "SuccessReceiptId" in (receipt.outcome.status as T.ReceiptSuccessId)
    ) {
      const { SuccessReceiptId } = receipt.outcome.status as T.ReceiptSuccessId;
      statusInfo = (
        <>
          <i>SuccessReceiptId: </i>
          <pre>{SuccessReceiptId}</pre>
        </>
      );
    }

    return statusInfo;
  };

  handleActionInfo = function (
    receiptObjInfo: T.ReceiptOutcomeInfo,
    senderIsReceiverActions = []
  ) {
    if (
      receiptObjInfo?.receipt &&
      (!senderIsReceiverActions || senderIsReceiverActions.length === 0)
    ) {
      const { Action: action = null } = receiptObjInfo?.receipt;

      if (action && action.actions && action.actions.length > 0) {
        const actionsList = action.actions.map((action, index) => (
          <Row noGutters key={`${action[Object.keys(action)[0]]}_${index}`}>
            {action[Object.keys(action)[0]]?.method_name ? (
              <Col>
                <b>{Object.keys(action)[0]}:</b>{" "}
                {action[Object.keys(action)[0]].method_name}
              </Col>
            ) : (
              <Col>{Object.keys(action)[0]}</Col>
            )}
          </Row>
        ));

        return actionsList;
      }
    } else if (senderIsReceiverActions && senderIsReceiverActions.length > 0) {
      const actionsList = senderIsReceiverActions.map(
        (action: T.Action, index) => (
          <Row noGutters key={`${action.kind}_${index}`}>
            {action?.args && action.args.method_name ? (
              <Col>
                <b>{action.kind}:</b> {action.args.method_name}
              </Col>
            ) : (
              <Col>{action.kind}</Col>
            )}
          </Row>
        )
      );

      return actionsList;
    }
    return "No actions";
  };

  renderRow = (
    receiptsObj,
    receiptsInfoObj,
    receiptHash,
    senderIsReceiver = false,
    senderIsReceiverActions = []
  ) => (
    <Row
      noGutters
      className={
        !senderIsReceiver ? "receipt-row pl-4 mx-0" : "receipt-sir-row"
      }
      key={receiptsObj[receiptHash].id}
    >
      <Col>
        <Row noGutters>
          <Col className="receipt-row-title receipt-hash-title">
            <b>Receipt ID:</b>
          </Col>
          <Col
            className="receipt-row-receipt-hash ml-auto text-right"
            title={receiptsObj[receiptHash].id}
          >
            {`${receiptsObj[receiptHash].id.substr(0, 7)}...`}
          </Col>
        </Row>

        {!senderIsReceiver && (
          <>
            <Row noGutters className="receipt-row mx-0 pl-4">
              <Col className="receipt-row-title">Predecessor ID:</Col>
              <Col
                className="receipt-row-receipt-hash"
                title={
                  receiptsInfoObj[receiptsObj[receiptHash].id].predecessor_id
                }
              >
                {receiptsInfoObj[receiptsObj[receiptHash].id].predecessor_id}
              </Col>
            </Row>

            <Row noGutters className="receipt-row mx-0 pl-4">
              <Col className="receipt-row-title">Receiver ID:</Col>
              <Col
                className="receipt-row-receipt-hash"
                title={receiptsInfoObj[receiptsObj[receiptHash].id].receiver_id}
              >
                {receiptsInfoObj[receiptsObj[receiptHash].id].receiver_id}
              </Col>
            </Row>
          </>
        )}

        <Row noGutters className="receipt-row mx-0 pl-4">
          <Col className="receipt-row-title">Actions:</Col>
          <Col className="receipt-row-text">
            {this.handleActionInfo(
              receiptsInfoObj[receiptsObj[receiptHash].id],
              senderIsReceiverActions
            )}
          </Col>
        </Row>

        <Row noGutters className="receipt-row mx-0 pl-4">
          <Col className="receipt-row-title">
            {this.handleStatusInfo(receiptsObj[receiptHash])}
          </Col>
        </Row>

        <Row noGutters className="receipt-row mx-0 pl-4">
          <Col className="receipt-row-text">
            {receiptsObj[receiptHash].outcome.logs.length === 0 ? (
              "No logs"
            ) : (
              <pre>{receiptsObj[receiptHash].outcome.logs.join("\n")}</pre>
            )}
          </Col>
        </Row>

        {receiptsObj[receiptHash]?.outcome.receipt_ids &&
          receiptsObj[
            receiptHash
          ].outcome?.receipt_ids.map((executedReceiptHash: string) =>
            this.renderRow(receiptsObj, receiptsInfoObj, executedReceiptHash)
          )}
      </Col>
    </Row>
  );

  render() {
    const {
      sirReceiptHash: receiptHash,
      receiptsObj,
      receiptsInfoObj,
      senderIsReceiver,
      senderIsReceiverActions,
    } = this.props;

    return (
      <>
        {this.renderRow(
          receiptsObj,
          receiptsInfoObj,
          receiptHash,
          senderIsReceiver,
          senderIsReceiverActions
        )}

        <style jsx global>{`
          .receipt-sir-row {
            padding-bottom: 30px;
          }

          .receipt-row {
            padding-top: 10px;
            border-left: 2px solid #dcdcdc;
          }

          .receipt-hash-title {
            padding-bottom: 10px;
          }

          .receipt-row-bottom {
            border-bottom: solid 2px #f8f8f8;
          }

          .receipt-row-title,
          .receipt-row-info {
            font-size: 14px;
            line-height: 1.29;
            color: #24272a;
          }

          .receipt-row-text {
            font-size: 12px;
            line-height: 1.5;
            color: #999999;
          }

          .receipt-row-receipt-hash {
            font-size: 14px;
            font-weight: 500;
            line-height: 1.29;
          }

          .receipt-row-status {
            font-size: 12px;
            color: #999999;
            font-weight: 500;
          }
        `}</style>
      </>
    );
  }
}
