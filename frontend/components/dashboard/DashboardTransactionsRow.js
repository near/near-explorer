import { Row, Col } from "react-bootstrap";

import Timer from "../utils/Timer";
import GetTransactionIcon from "../utils/GetTransactionIcon";

const DashboardTransactionRow = props => (
  <Row noGutters="true">
    <Col xs="1" className="dashboard-transactions-icon-col">
      <div className="dashboard-transaction-row-img">
        {GetTransactionIcon[props.txType]}
      </div>
    </Col>
    <Col className="dashboard-transaction-row pl-0" xs="11" md="11">
      <Row noGutters="true">
        <Col xs="8">
          <Row>
            <Col className="dashboard-transaction-row-title">
              {props.txKind}: {props.txArgs}
            </Col>
          </Row>
          <Row>
            <Col className="dashboard-transaction-row-content">
              by @{props.txOriginator}
            </Col>
          </Row>
        </Col>
        <Col className="ml-auto text-right" xs="4" md="auto">
          <Row>
            <Col className="dashboard-transaction-txid d-none d-sm-block">
              {props.txHash.substring(0, 7)}...
            </Col>
          </Row>
          <Row>
            <Col className="dashboard-transaction-timer">
              {`${props.txStatus} `}
              <Timer time={props.blockTimestamp} />
            </Col>
          </Row>
        </Col>
      </Row>
    </Col>
    <style jsx global>{`
      .dashboard-transaction-row {
        border-bottom: 2px solid #f8f8f8;
        margin-bottom: 15px;
        padding-bottom: 8px;
      }

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

      .dashboard-transaction-timer {
        font-family: BentonSans;
        font-size: 12px;
        font-weight: 500;
        color: #999999;
      }
    `}</style>
  </Row>
);

export default DashboardTransactionRow;
