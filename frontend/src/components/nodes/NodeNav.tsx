import Link from "next/link";

import React from "react";
import { Row, Col } from "react-bootstrap";

import { NodeStatsConsumer } from "../../context/NodeStatsProvider";

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
              <Link href="/nodes/validators">
                <a
                  className={`node-link ${
                    role === "validators" ? `node-selected` : ""
                  }`}
                  id="validator-node"
                >
                  <Col className="node-selector align-self-center">
                    {context.validatorAmount
                      ? `${context.validatorAmount}  Validating`
                      : `- Validating`}
                  </Col>
                </a>
              </Link>
              <Link href="/nodes/online-nodes">
                <a
                  className={`node-link ${
                    role === "online-nodes" ? `node-selected` : ""
                  }`}
                  id="online-node"
                >
                  <Col className="node-selector align-self-center">
                    {context.onlineNodeAmount
                      ? `${context.onlineNodeAmount} Online-nodes`
                      : `- Online-nodes`}
                  </Col>
                </a>
              </Link>
              <Link href="/nodes/proposals">
                <a
                  className={`node-link ${
                    role === "proposals" ? `node-selected` : ""
                  }`}
                  id="proposal-node"
                >
                  <Col className="node-selector align-self-center">
                    {context.proposalAmount
                      ? `${context.proposalAmount} Proposal-nodes`
                      : `- Proposal-nodes`}
                  </Col>
                </a>
              </Link>
              <Link href="/nodes/map">
                <a className="node-link">
                  <Col className="node-selector align-self-center">
                    Nodes Map
                  </Col>
                </a>
              </Link>
            </Row>
            <style jsx global>{`
              .node-selector {
                font-size: 12px;
                font-weight: 500;
                letter-spacing: 1.38px;
                color: #24272a;
                text-transform: uppercase;
                padding: 10px;
                text-decoration: none;
              }

              .node-link {
                text-align: center;
                background: #fff;
                border: 2px solid #e6e6e6;
                box-sizing: border-box;
                border-radius: 25px;
                margin-left: 15px;
                margin-bottom: 15px;
              }

              .node-link:active,
              .node-link:focus {
                border: 2px solid #0066ff;
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
