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
            <Row>
              <Col className="node-selector align-self-center" md="4">
                <Link href="/nodes/validators">
                  <a
                    className={`node-link ${
                      role === "validators" ? `node-selected` : ""
                    }`}
                    id="validator-node"
                  >
                    {`${
                      typeof context.validatorAmount !== "undefined"
                        ? context.validatorAmount
                        : "-"
                    } Validating & New Upcoming`}
                  </a>
                </Link>
              </Col>
              <Col className="node-selector align-self-center">
                <Link href="/nodes/online-nodes">
                  <a
                    className={`node-link ${
                      role === "online-nodes" ? `node-selected` : ""
                    }`}
                    id="online-node"
                  >
                    {`${
                      typeof context.onlineNodeAmount !== "undefined"
                        ? context.onlineNodeAmount
                        : "-"
                    } Online-nodes`}
                  </a>
                </Link>
              </Col>
              <Col className="node-selector align-self-center">
                <Link href="/nodes/proposals">
                  <a
                    className={`node-link ${
                      role === "proposals" ? `node-selected` : ""
                    }`}
                    id="proposal-node"
                  >
                    {`${
                      typeof context.proposalAmount !== "undefined"
                        ? context.proposalAmount
                        : "-"
                    } Proposal-nodes`}
                  </a>
                </Link>
              </Col>
              <Col className="node-selector align-self-center">
                <Link href="/nodes/map">
                  <a className="node-link" id="node-map">
                    Nodes Map
                  </a>
                </Link>
              </Col>
            </Row>
            <style jsx global>{`
              .node-selector {
                font-size: 12px;
                font-weight: 500;
                letter-spacing: 1.38px;
                color: #24272a;
                text-transform: uppercase;
                text-decoration: none;
                margin-left: 15px;
                margin-bottom: 15px;
              }

              .node-link {
                text-align: center;
                background: #fff;
                border: 2px solid #e6e6e6;
                box-sizing: border-box;
                border-radius: 25px;
                padding: 10px;
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
