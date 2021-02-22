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
            <Row className="node-nav" noGutters>
              <Col
                md="4"
                className={`node-selector p-1 pl-3 ${
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
                className={`node-selector p-1 pl-3 ${
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
                className={`node-selector p-1 pl-3 ${
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
              <Col className="node-selector p-1 pl-3">
                <Link href="/nodes/map">
                  <a className="node-link" id="node-map">
                    Nodes Map
                  </a>
                </Link>
              </Col>
            </Row>
            <style jsx global>{`
              .node-nav {
                width: 100%;
                height: 32px;
                background: rgba(106, 209, 227, 0.15);
                box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1);
                color: #24272a;
              }

              .node-selector {
                height: 100%;
                font-size: 16px;
                font-weight: 500;
                text-transform: uppercase;
                text-decoration: none;
              }

              .node-link {
                color: #0d60b9;
              }

              .node-link:hover {
                color: #5ccee2;
              }

              .node-selected {
                background: #fff;
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
