import Link from "next/link";

import { Row, Col, Card } from "react-bootstrap";

import EmptyRow from "../utils/EmptyRow";
import { DataConsumer } from "../utils/DataProvider";

import DashboardBlocksBlock from "./DashboardBlocksBlock";

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
        <DataConsumer>
          {ctx => (
            <Row className="gutter-4">
              {ctx.blocks.slice(0, 8).map(block => (
                <DashboardBlocksBlock
                  key={block.hash}
                  blockHash={block.hash}
                  blockHeight={block.height}
                  blockTimestamp={block.timestamp}
                  transactionsCount={block.transactionsCount}
                />
              ))}
            </Row>
          )}
        </DataConsumer>
        <Row>
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
