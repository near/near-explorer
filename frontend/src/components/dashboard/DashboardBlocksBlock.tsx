import Link from "next/link";
import BN from "bn.js";
import React from "react";

import { Row, Col, Card } from "react-bootstrap";

import { DatabaseConsumer } from "../../context/DatabaseProvider";

import Timer from "../utils/Timer";

export interface Props {
  block: {
    hash: string;
    height: number;
    prevHash: string;
    timestamp: number;
    transactionsCount: number;
  };
}
export default class extends React.Component<Props> {
  render() {
    const { block } = this.props;
    let timestamp = block.timestamp;
    if (typeof timestamp === "string") {
      timestamp = new BN(timestamp).div(new BN(10 ** 6)).toNumber();
    }
    return (
      <DatabaseConsumer>
        {(context) => (
          <Col xs={12} xl={6}>
            <Link href="/blocks/[hash]" as={`/blocks/${block.hash}`}>
              <a className="dashboard-blocks-block-link">
                <Card
                  className="dashboard-blocks-block"
                  style={{
                    background:
                      timestamp <= context.finalTimestamp ? "#fff" : "#f8f7f8",
                  }}
                >
                  <Card.Title className="dashboard-blocks-block-title">
                    #{block.height}
                  </Card.Title>
                  <Card.Body className="dashboard-blocks-block-content">
                    <>
                      {timestamp <= context.finalTimestamp ? (
                        <p className="dashboard-blocks-block-content-p">
                          <img src="/static/images/icon-m-transaction.svg" />
                          {block.transactionsCount}
                        </p>
                      ) : (
                        <div style={{ height: "22px", width: "100%" }}> </div>
                      )}
                    </>
                    {timestamp <= context.finalTimestamp ? (
                      <Row noGutters className="dashboard-blocks-block-footer">
                        <Col md="7" xs="7">
                          <span className="dashboard-blocks-block-content-p-footer">
                            {block.hash.slice(0, 6)}...
                          </span>
                        </Col>
                        <Col
                          md="5"
                          xs="5"
                          className="align-self-center text-right"
                        >
                          <span className="dashboard-blocks-block-timer">
                            <Timer time={timestamp} />
                          </span>
                        </Col>
                      </Row>
                    ) : (
                      <Row
                        noGutters
                        className="dashboard-blocks-block-footer non-finality-back"
                      >
                        <span className="non-finality-color dashboard-blocks-block-content-p-footer ">
                          Finalizing...
                        </span>
                      </Row>
                    )}
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
                padding-top: 10px;
                border-radius: 8px;
                border: solid 4px #e6e6e6;
                margin-top: 8px;
              }

              .dashboard-blocks-block-title {
                font-family: BentonSans;
                font-size: 18px;
                font-weight: 500;
                color: #24272a;
                margin-left: 10px;
              }

              .dashboard-blocks-block-content {
                padding: 0 !important;
              }

              .dashboard-blocks-block-content-p {
                line-height: 8px;
                font-family: BentonSans;
                font-size: 14px;
                color: #999999;
                margin-left: 10px;
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

              .non-finality-back {
                background: #e6e5e6;
              }

              .non-finality-color {
                color: #929192 !important;
                padding-top: 5px;
              }

              .dashboard-blocks-block-footer {
                height: 32px;
                padding: 0 10px 10px;
                width: 100%;
              }
            `}</style>
          </Col>
        )}
      </DatabaseConsumer>
    );
  }
}
