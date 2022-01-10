import BN from "bn.js";
import { FC, useState, useEffect } from "react";
import { Accordion, Container, Row, Col } from "react-bootstrap";
import { Translate } from "react-localize-redux";

import TransactionsApi from "../../libraries/explorer-wamp/transactions";
import Balance from "../utils/Balance";
import Gas from "../utils/Gas";
import Timer from "../utils/Timer";
import TransactionActionSketch from "./TransactionActionSketch";

const TransactionDetailsSketch: FC<any> = ({ transaction }) => {
  const [transactionDetails, setTransactionDetails] = useState<any>();
  useEffect(() => {
    new TransactionsApi()
      .getTransactionDetails(transaction.hash)
      .then(setTransactionDetails);
  }, [transaction.hash]);

  if (!transactionDetails) {
    return null;
  }
  return (
    <>
      <div
        className="header-content"
        style={{
          backgroundColor: "#3f4246",
          color: "#ffffff",
        }}
      >
        <Container>
          <Row className="align-items-center" style={{ padding: "27px 0" }}>
            <Col>
              <h1
                style={{
                  color: "#ffffff",
                  fontSize: "30px",
                  fontWeight: "600",
                  lineHeight: "150%",
                  margin: "0",
                }}
              >
                <Translate id="common.transactions.transaction" /> <br />
              </h1>
              <span>
                {`${transaction.hash.substring(
                  0,
                  7
                )}...${transaction.hash.substring(
                  transaction.hash.length - 4
                )}`}
              </span>
            </Col>
            <Col>{transaction?.status}</Col>
            <Col>
              Fee <br />
              {transactionDetails.transactionFee ? (
                <Balance
                  amount={transactionDetails.transactionFee.toString()}
                />
              ) : (
                "..."
              )}
            </Col>
            <Col>
              Attached <br />
              {transactionDetails.gasAttached ? (
                <Gas gas={new BN(transactionDetails.gasAttached)} />
              ) : (
                "..."
              )}
            </Col>
            <Col>
              Burned <br />
              {transactionDetails.gasUsed ? (
                <Gas gas={new BN(transactionDetails.gasUsed)} />
              ) : (
                "..."
              )}
            </Col>
            <Col>
              <Timer time={transactionDetails?.blockTimestamp} />
            </Col>
          </Row>
        </Container>
      </div>

      {transactionDetails.receipts.length > 0 ? (
        <Container>
          <Accordion>
            {transactionDetails.receipts.map((receipt: any, index: number) => (
              <TransactionActionSketch receipt={receipt} index={`${index}`} />
            ))}
          </Accordion>
        </Container>
      ) : (
        "empty"
      )}
    </>
  );
};

export default TransactionDetailsSketch;
