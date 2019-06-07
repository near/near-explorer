import Link from "next/link";

import { Row, Col } from "react-bootstrap";

const DashboardTransactions = () => (
  <div>
    <Row>
      <Col>&nbsp;</Col>
    </Row>
    <Row noGutters="true">
      <Col className="dashboard-transactions-title">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          viewBox="0 0 26 26"
        >
          <g
            fill="none"
            fill-rule="evenodd"
            stroke="#CCC"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          >
            <path d="M7 19h18M7 25l-6-6 6-6M19 7H1M19 1l6 6-6 6" />
          </g>
        </svg>
        &nbsp;&nbsp; Recent Transactions
      </Col>
    </Row>
    <Row>
      <Col className="dashboard-transactions-content-box">&nbsp;</Col>
    </Row>
    <style jsx global>{`
      .dashboard-transactions-title {
        font-family: BwSeidoRound;
        font-size: 24px;
        font-weight: 500;
        color: #24272a;
      }

      .dashboard-transactions-content-box {
        border-left: 4px solid black;
      }
    `}</style>
  </div>
);

export default DashboardTransactions;
