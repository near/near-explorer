import Link from "next/link";

import { Row, Col, Card } from "react-bootstrap";

const EmptyRow = () => (
  <Row>
    <Col>&nbsp;</Col>
  </Row>
);

const DashboardBlocksBlock = props => (
  <Col>
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
      .dashboard-blocks-block-link:hover {
        text-decoration: none;
      }

      .dashboard-blocks-block {
        padding: 10px;
        border-radius: 5px;
        border: solid 4px #e6e6e6;
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
    <Row noGutters="true">
      <Col className="dashboard-transactions-title">
        <svg
          width="26"
          height="26"
          viewBox="0 0 38 38"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g
            fill="none"
            stroke="#CCC"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          >
            <path d="m1 1h27v27h-27z" />
            <circle cx="22" cy="22" r="12" />
            <path d="m30.49 30.49 6.51 6.51" />
          </g>
        </svg>
        &nbsp; Recent Blocks
      </Col>
    </Row>
    <EmptyRow />
    <Row noGutters="true">
      <Col md="1" />
      <DashboardBlocksBlock
        blockNumber="6066099"
        blockHash="1a2b3c4d5e6f"
        transactionsCount="254"
        blockHeight="15489"
        witness="vlad.near"
      />
      <Col md="auto">&nbsp;&nbsp;&nbsp;</Col>
      <DashboardBlocksBlock
        blockNumber="6066098"
        blockHash="1a2b3c4d5e6f"
        transactionsCount="254"
        blockHeight="15489"
        witness="vlad.near"
      />
    </Row>
    <EmptyRow />
    <Row noGutters="true">
      <Col md="1" />
      <DashboardBlocksBlock
        blockNumber="6066099"
        blockHash="1a2b3c4d5e6f"
        transactionsCount="254"
        blockHeight="15489"
        witness="vlad.near"
      />
      <Col md="auto">&nbsp;&nbsp;&nbsp;</Col>
      <DashboardBlocksBlock
        blockNumber="6066098"
        blockHash="1a2b3c4d5e6f"
        transactionsCount="254"
        blockHeight="15489"
        witness="vlad.near"
      />
    </Row>
    <EmptyRow />
    <Row noGutters="true">
      <Col md="1" />
      <DashboardBlocksBlock
        blockNumber="6066099"
        blockHash="1a2b3c4d5e6f"
        transactionsCount="254"
        blockHeight="15489"
        witness="vlad.near"
      />
      <Col md="auto">&nbsp;&nbsp;&nbsp;</Col>
      <DashboardBlocksBlock
        blockNumber="6066098"
        blockHash="1a2b3c4d5e6f"
        transactionsCount="254"
        blockHeight="15489"
        witness="vlad.near"
      />
    </Row>
    <EmptyRow />
    <Row noGutters="true">
      <Col md="1" />
      <DashboardBlocksBlock
        blockNumber="6066099"
        blockHash="1a2b3c4d5e6f"
        transactionsCount="254"
        blockHeight="15489"
        witness="vlad.near"
      />
      <Col md="auto">&nbsp;&nbsp;&nbsp;</Col>
      <DashboardBlocksBlock
        blockNumber="6066098"
        blockHash="1a2b3c4d5e6f"
        transactionsCount="254"
        blockHeight="15489"
        witness="vlad.near"
      />
    </Row>
    <EmptyRow />
    <style jsx global>{``}</style>
  </div>
);

export default DashboardBlocks;
