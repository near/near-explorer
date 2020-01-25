import Link from "next/link";
import React from "react";

import { Row, Col, Card } from "react-bootstrap";

import Timer from "../utils/Timer";

export default class extends React.Component {
  render() {
    const {
      blockHash,
      blockHeight,
      blockTimestamp,
      transactionsCount
    } = this.props;
    return (
      <Col xs={12} xl={6}>
        <Link href="/blocks/[hash]" as={`/blocks/${blockHash}`}>
          <a className="dashboard-blocks-block-link">
            <Card className="dashboard-blocks-block">
              <Card.Title className="dashboard-blocks-block-title">
                #{blockHeight}
              </Card.Title>
              <Card.Body className="dashboard-blocks-block-content">
                <p className="dashboard-blocks-block-content-p">
                  <img src="/static/images/icon-m-transaction.svg" />
                  {transactionsCount}
                </p>
                <Row noGutters>
                  <Col md="7" xs="7">
                    <span className="dashboard-blocks-block-content-p-footer">
                      {blockHash.slice(0, 6)}...
                    </span>
                  </Col>
                  <Col md="5" xs="5" className="align-self-center text-right">
                    <span className="dashboard-blocks-block-timer">
                      <Timer time={blockTimestamp} />
                    </span>
                  </Col>
                </Row>
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

          .dashboard-blocks-block-content-p > img {
            width: 12px;
            margin-right: 5px;
            margin-left: 5px;
            margin-top: -4px;
          }

          .dashboard-blocks-block-content-p-footer {
            font-family: BentonSans;
            font-size: 14px;
            font-weight: 500;
            color: #0072ce;
            margin-left: 0;
          }

          .dashboard-blocks-block-timer {
            font-family: BentonSans;
            font-size: 12px;
            color: #999999;
          }
        `}</style>
      </Col>
    );
  }
}
