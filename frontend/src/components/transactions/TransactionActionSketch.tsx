import { FC } from "react";
import BN from "bn.js";
import { Accordion, Card, Col, Row, Tab, Tabs } from "react-bootstrap";
import { Translate } from "react-localize-redux";

import * as T from "../../libraries/explorer-wamp/transactions";
import Gas from "../utils/Gas";
import Balance from "../utils/Balance";
import { displayArgs } from "./ActionMessage";

const TransactionActionSketch: FC<any> = ({ receipt, index }) => {
  let statusInfo;
  if ("SuccessValue" in (receipt.status as T.ReceiptSuccessValue)) {
    const { SuccessValue } = receipt.status as T.ReceiptSuccessValue;
    if (SuccessValue === null) {
      statusInfo = (
        <Translate id="component.transactions.ReceiptRow.no_result" />
      );
    } else if (SuccessValue.length === 0) {
      statusInfo = (
        <Translate id="component.transactions.ReceiptRow.empty_result" />
      );
    } else {
      statusInfo = <>{displayArgs(SuccessValue)}</>;
    }
  } else if ("Failure" in (receipt.status as T.ReceiptFailure)) {
    const { Failure } = receipt.status as T.ReceiptFailure;
    statusInfo = (
      <>
        <i>
          <Translate id="component.transactions.ReceiptRow.failure" />:{" "}
        </i>
        <pre>{JSON.stringify(Failure, null, 2)}</pre>
      </>
    );
  } else if ("SuccessReceiptId" in (receipt.status as T.ReceiptSuccessId)) {
    const { SuccessReceiptId } = receipt.status as T.ReceiptSuccessId;
    statusInfo = (
      <>
        <i>
          <Translate id="component.transactions.ReceiptRow.success_receipt_id" />
          :{" "}
        </i>
        <pre>{SuccessReceiptId}</pre>
      </>
    );
  }

  let actionType = receipt.actions[0]?.kind || undefined;
  if (receipt?.actions[0]?.kind === "FunctionCall") {
    actionType = `Call "${receipt.actions[0]?.args?.method_name}"`;
  }

  return (
    <Card
      style={{
        margin: "11px 0",
        boxShadow: "0px 0px 30px rgba(66, 0, 255, 0.05)",
      }}
    >
      <Accordion.Toggle
        as={Card.Body}
        eventKey={index}
        style={{
          boxShadow: "0px 0px 30px rgba(66, 0, 255, 0.05)",
        }}
      >
        <Row>
          <Col title={receipt.actions[0]?.kind}>{actionType}</Col>
          <Col title="from">
            {`</>`}&nbsp;{receipt.signerId} {`=>`}
          </Col>
          <Col title="to">
            {`</>`}&nbsp;{receipt.receiverId}
          </Col>
        </Row>
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={index}>
        <Card.Body>
          <Tabs
            defaultActiveKey="details"
            id={`receipt_tabs_${receipt.receiptId}`}
          >
            <Tab eventKey="details" title="Details">
              <Row>
                <Col>
                  <b>Args:</b>
                  <br />
                  {receipt.actions[0]?.args?.args
                    ? displayArgs(receipt.actions[0]?.args?.args)
                    : "The arguments are empty"}
                </Col>
                <Col>
                  <Col xs={12}>
                    <b>Result:</b> <br />
                    {statusInfo}
                  </Col>
                  <br />
                  <Col xs={12}>
                    <b>Logs:</b>
                    <br />
                    {receipt.logs.length === 0 ? (
                      "Empty"
                    ) : (
                      <pre>{receipt.logs.join("\n")}</pre>
                    )}
                  </Col>
                </Col>
              </Row>
            </Tab>
            <Tab eventKey="inspect" title="Inspect">
              <Card.Text>
                <Row>
                  <Col>Signed with</Col>
                  <Col>?</Col>
                </Row>
                <Row>
                  <Col>Receipt ID</Col>
                  <Col>{receipt.receiptId}</Col>
                </Row>
                <Row>
                  <Col>Executed</Col>
                  <Col>?</Col>
                </Row>
                <Row>
                  <Col>Sined By</Col>
                  <Col>{receipt.signerId}</Col>
                </Row>
                <Row>
                  <Col>Executed in Block</Col>
                  <Col>{receipt.includedInBlockHash}</Col>
                </Row>
                <Row>
                  <Col>Predecessor ID</Col>
                  <Col>{receipt.signerId}&nbsp;???</Col>
                </Row>
                <Row>
                  <Col>Receiver ID</Col>
                  <Col>{receipt.receiverId}</Col>
                </Row>
                <Row>
                  <Col>Attached Gas</Col>
                  <Col>????</Col>
                </Row>
                <Row>
                  <Col>Gas Burned</Col>
                  <Col>
                    <Gas gas={new BN(receipt.gasBurnt)} />
                  </Col>
                </Row>
                <Row>
                  <Col>Precharged</Col>
                  <Col>????</Col>
                </Row>
                <Row>
                  <Col>Tokens Burned</Col>
                  <Col>
                    <Balance amount={receipt.tokensBurnt.toString()} />
                  </Col>
                </Row>
                <Row>
                  <Col>Tokens Refunded</Col>
                  <Col>
                    {receipt.actions[0]?.args?.deposit ? (
                      <Balance
                        amount={receipt.actions[0]?.args?.deposit?.toString()}
                      />
                    ) : (
                      "0"
                    )}
                  </Col>
                </Row>
              </Card.Text>
            </Tab>
          </Tabs>
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
};

export default TransactionActionSketch;
