import { Row, Col } from "react-bootstrap";

const TransactionImage = {
  Call: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 18 18"
    >
      <path
        fill="#999"
        fill-rule="evenodd"
        d="M0 9l6 6L9 0 0 9zm9 9l9-9-6-6-3 15z"
      />
    </svg>
  ),
  Sent: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 18 18"
    >
      <path fill="#8FD6BD" fill-rule="evenodd" d="M6 0v6L0 0v12l6-6v6l6-6z" />
    </svg>
  )
};

const DashboardTransactionRow = props => (
  <Row noGutters="true">
    <Col md="auto">
      <div className="dashboard-transaction-row-img">
        {TransactionImage[props.txType]}
      </div>
    </Col>
    <Col md="7">
      <Row>
        <Col className="dashboard-transaction-row-title">
          {props.txType}: {props.txMsg}
        </Col>
      </Row>
      <Row>
        <Col className="dashboard-transaction-row-content">
          {props.contractName} by @{props.username}
        </Col>
      </Row>
    </Col>
    <Col md="4">
      <Row>
        <Col className="dashboard-transaction-txid">
          {props.txId.substring(0, 7)}...
        </Col>
      </Row>
      <Row>
        <Col>&nbsp;</Col>
      </Row>
    </Col>
    <style jsx global>{`
      .dashboard-transaction-row-img {
        width: 24px;
        height: 24px;
        border: solid 2px #f8f8f8;
        background-color: #ffffff;
        border-radius: 50%;
        margin-right: 8px;
        text-align: center;
        line-height: 1.1;
      }

      .dashboard-transaction-row-title {
        font-family: BentonSans;
        font-size: 14px;
        font-weight: 500;
        color: #24272a;
      }

      .dashboard-transaction-row-content {
        font-family: BentonSans;
        font-size: 12px;
        font-weight: 500;
        color: #999999;
      }

      .dashboard-transaction-txid {
        font-family: BentonSans;
        font-size: 14px;
        font-weight: 500;
        color: #0072ce;
      }
    `}</style>
  </Row>
);

export default DashboardTransactionRow;
