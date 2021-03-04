import React from "react";
import { Row, Col } from "react-bootstrap";

import { NodeStatsConsumer } from "../../context/NodeStatsProvider";

import Link from "../utils/Link";

interface Props {
  role: string;
}

export default class extends React.Component<Props> {
  render() {
    const { role } = this.props;
    return (
      <NodeStatsConsumer>
        {(context) => (
          <>
            <Row noGutters>
              <Col
                md="4"
                className={`node-selector pt-2 pb-2 ${
                  role === "validators" ? `node-selected` : ""
                }`}
              >
                <Link href="/nodes/validators">
                  <a className="node-link" id="validator-node">
                    {`${
                      typeof context.validatorAmount !== "undefined"
                        ? context.validatorAmount
                        : "-"
                    } Validating & New Upcoming`}
                  </a>
                </Link>
              </Col>
              <Col
                className={`node-selector pt-2 pb-2 ${
                  role === "online-nodes" ? `node-selected` : ""
                }`}
              >
                <Link href="/nodes/online-nodes">
                  <a className="node-link" id="online-node">
                    {`${
                      typeof context.onlineNodeAmount !== "undefined"
                        ? context.onlineNodeAmount
                        : "-"
                    } Online-nodes`}
                  </a>
                </Link>
              </Col>
              <Col
                className={`node-selector pt-2 pb-2 ${
                  role === "proposals" ? `node-selected` : ""
                }`}
              >
                <Link href="/nodes/proposals">
                  <a className="node-link" id="proposal-node">
                    {`${
                      typeof context.proposalAmount !== "undefined"
                        ? context.proposalAmount
                        : "-"
                    } Proposal-nodes`}
                  </a>
                </Link>
              </Col>
              <Col className="node-selector pt-2 pb-2">
                <Link href="/nodes/map">
                  <a className="node-link" id="node-map">
                    Nodes Map
                  </a>
                </Link>
              </Col>
            </Row>
            <style jsx global>{`
              .node-selector {
                height: 100%;
                font-size: 14px;
                font-weight: 500;
                background: #fff;
                border: 2px solid #e6e6e6;
                border-radius: 25px;
                text-transform: uppercase;
                text-decoration: none;
                margin-left: 15px;
                margin-bottom: 15px;
                text-align: center;
              }

              .node-link {
                color: #24272a;
              }

              .node-selected {
                border: 2px solid #0066ff;
              }

              .node-icon {
                margin: 10px;
              }
            `}</style>
          </>
        )}
      </NodeStatsConsumer>
    );
  }
}
