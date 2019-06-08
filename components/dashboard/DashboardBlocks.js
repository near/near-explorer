import Link from "next/link";

import { Row, Col, Card } from "react-bootstrap";

const EmptyRow = () => (
  <Row>
    <Col>&nbsp;</Col>
  </Row>
);

const DashboardBlocksBlock = props => (
  <Col xs="6">
    <Link href={"block/" + props.blockNumber}>
      <a className="dashboard-blocks-block-link">
        <Card className="dashboard-blocks-block">
          <Card.Title className="dashboard-blocks-block-title">
            #{props.blockNumber}
          </Card.Title>
          <Card.Body className="dashboard-blocks-block-content">
            <p className="dashboard-blocks-block-content-p">
              {props.transactionsCount}
            </p>
            <p className="dashboard-blocks-block-content-p">
              {props.blockHeight}
            </p>
            <p className="dashboard-blocks-block-content-p">@{props.witness}</p>
            <p className="dashboard-blocks-block-content-p-footer">
              {props.blockHash.substring(0, 7)}...
            </p>
          </Card.Body>
        </Card>
      </a>
    </Link>
    <style jsx global>{`
      .dashboard-blocks-block-link {
        cursor: pointer;
      }

      .dashboard-blocks-block-link:hover {
        text-decoration: none;
      }

      .dashboard-blocks-block {
        padding: 10px;
        border-radius: 8px;
        border: solid 4px #e6e6e6;
        margin-top: 8px;
      }

      .dashboard-blocks-block-title {
        font-family: BentonSans;
        font-size: 18px;
        font-weight: 500;
        color: #24272a;
      }

      .dashboard-blocks-block-content {
        padding: 0 !important;
      }

      .dashboard-blocks-block-content-p {
        line-height: 8px;
        font-family: BentonSans;
        font-size: 14px;
        color: #999999;
      }

      .dashboard-blocks-block-content-p-footer {
        font-family: BentonSans;
        font-size: 14px;
        font-weight: 500;
        color: #0072ce;
        margin-bottom: 0;
      }
    `}</style>
  </Col>
);

const DashboardBlocks = () => (
  <div>
    <EmptyRow />
    <Row>
      <Col xs="1">
        <svg
          width="26"
          height="26"
          viewBox="0 0 38 38"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g
            fill="none"
            stroke="#CCC"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          >
            <path d="m1 1h27v27h-27z" />
            <circle cx="22" cy="22" r="12" />
            <path d="m30.49 30.49 6.51 6.51" />
          </g>
        </svg>
      </Col>
      <Col className="dashboard-transactions-title">Recent Blocks</Col>
    </Row>
    <Row>
      <Col xs="1">
        <div className="dashboard-blocks-hr-parent">
          <div className="dashboard-blocks-hr" />
        </div>
      </Col>
      <Col>
        <Row className="gutter-4">
          <DashboardBlocksBlock
            blockNumber="6066099"
            blockHash="1a2b3c4d5e6f"
            transactionsCount="254"
            blockHeight="15489"
            witness="vlad.near"
          />
          <DashboardBlocksBlock
            blockNumber="6066098"
            blockHash="1a2b3c4d5e6f"
            transactionsCount="254"
            blockHeight="15489"
            witness="vlad.near"
          />
          <DashboardBlocksBlock
            blockNumber="6066099"
            blockHash="1a2b3c4d5e6f"
            transactionsCount="254"
            blockHeight="15489"
            witness="vlad.near"
          />
          <DashboardBlocksBlock
            blockNumber="6066098"
            blockHash="1a2b3c4d5e6f"
            transactionsCount="254"
            blockHeight="15489"
            witness="vlad.near"
          />
          <DashboardBlocksBlock
            blockNumber="6066099"
            blockHash="1a2b3c4d5e6f"
            transactionsCount="254"
            blockHeight="15489"
            witness="vlad.near"
          />
          <DashboardBlocksBlock
            blockNumber="6066098"
            blockHash="1a2b3c4d5e6f"
            transactionsCount="254"
            blockHeight="15489"
            witness="vlad.near"
          />
          <DashboardBlocksBlock
            blockNumber="6066099"
            blockHash="1a2b3c4d5e6f"
            transactionsCount="254"
            blockHeight="15489"
            witness="vlad.near"
          />
          <DashboardBlocksBlock
            blockNumber="6066098"
            blockHash="1a2b3c4d5e6f"
            transactionsCount="254"
            blockHeight="15489"
            witness="vlad.near"
          />
          <Col xs="6">
            <Link href="blocks">
              <a className="dashboard-footer">View All</a>
            </Link>
          </Col>
        </Row>
      </Col>
    </Row>
    <EmptyRow />
    <style jsx global>{`
      .dashboard-blocks-hr-parent {
        width: 26px;
        height: 100%;
      }

      .dashboard-blocks-hr {
        border: solid 3px #f8f8f8;
        width: 1px;
        height: 100%;
        margin: 0 auto;
      }

      .dashboard-footer {
        width: 100px;
        background-color: #f8f8f8;
        display: block;
        text-align: center;
        text-decoration: none;
        font-family: BentonSans;
        font-size: 14px;
        color: #0072ce;
        font-weight: bold;
        text-transform: uppercase;
        margin-top: 20px;
        border-radius: 30px;
        padding: 8px 0;
      }

      .gutter-4.row {
        margin-right: -4px;
        margin-left: -4px;
      }
      .gutter-4 > [class^="col-"],
      .gutter-4 > [class^=" col-"] {
        padding-right: 4px;
        padding-left: 4px;
      }
    `}</style>
  </div>
);

export default DashboardBlocks;
