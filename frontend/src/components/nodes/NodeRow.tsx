import React from "react";
import { Row, Col, OverlayTrigger, Tooltip } from "react-bootstrap";

import * as N from "../../libraries/explorer-wamp/nodes";
import { StatsDataConsumer } from "../../context/StatsDataProvider";

import Timer from "../utils/Timer";

interface Props {
  node: N.NodeInfo;
}
export const statusIdentifier = new Map([
  ["AwaitingPeers", "Waiting for peers"],
  ["HeaderSync", "Syncing headers"],
  ["BlockSync", "Syncing blocks"],
  ["StateSync", "Syncing state"],
  ["StateSyncDone", "State sync is done"],
  ["BodySync", "Syncing body"],
  ["NoSync", ""],
]);
export default class extends React.PureComponent<Props> {
  render() {
    const { node } = this.props;
    return (
      <StatsDataConsumer>
        {(context) => (
          <Row className="node-row mx-0">
            <Col md="auto" xs="1" className="pr-0">
              <OverlayTrigger
                placement={"right"}
                overlay={<Tooltip id="nodes">online nodes</Tooltip>}
              >
                <img
                  src={"/static/images/icon-m-node-online.svg"}
                  style={{ width: "15px" }}
                />
              </OverlayTrigger>
            </Col>
            <Col md="7" xs="7">
              <Row>
                <Col className="node-row-title">
                  @{node.accountId}
                  <span className="node-status">
                    {" "}
                    {statusIdentifier.get(node.status)}
                  </span>
                </Col>
              </Row>
              <Row>
                <Col className="node-row-text">
                  <Row>
                    <Col md={5}>
                      <img
                        src="/static/images/icon-m-size.svg"
                        style={{ width: "12px" }}
                      />
                      {`${node.agentName} | ver.${node.agentVersion} build  ${node.agentBuild}`}
                    </Col>
                    <Col
                      className={
                        Math.abs(
                          node.lastHeight - context.dashState.lastBlockHeight
                        ) > 1000
                          ? "text-danger"
                          : Math.abs(
                              node.lastHeight -
                                context.dashState.lastBlockHeight
                            ) > 50
                          ? "text-warning"
                          : ""
                      }
                      md={3}
                    >
                      <img
                        src="/static/images/icon-m-block.svg"
                        style={{ width: "12px" }}
                      />
                      {` ${node.lastHeight}`}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col md="3" xs="3" className="ml-auto text-right">
              <Row>
                <Col className="node-row-txid" title={node.nodeId}>
                  {node.nodeId.substring(8, 20)}...
                </Col>
              </Row>
              <Row>
                <Col className="node-row-timer">
                  <span className="node-row-timer-status">Last seen</span>
                  &nbsp;&nbsp;
                  <Timer time={node.lastSeen} />
                </Col>
              </Row>
            </Col>
            <style jsx global>{`
              .node-row {
                padding-top: 10px;
                padding-bottom: 10px;
                border-top: solid 2px #f8f8f8;
              }

              .node-row:hover {
                background: rgba(0, 0, 0, 0.1);
              }

              .node-row-bottom {
                border-bottom: solid 2px #f8f8f8;
              }

              .node-row-title {
                font-family: BentonSans;
                font-size: 14px;
                font-weight: 500;
                line-height: 1.29;
                color: #24272a;
              }

              .node-row-text {
                font-family: BentonSans;
                font-size: 12px;
                font-weight: 500;
                line-height: 1.5;
                color: #999999;
              }

              .node-row-txid {
                font-family: BentonSans;
                font-size: 14px;
                font-weight: 500;
                line-height: 1.29;
                color: #4a4f54;
              }

              .node-row-timer {
                font-family: BentonSans;
                font-size: 12px;
                color: #999999;
                font-weight: 100;
              }

              .node-row-timer-status {
                font-weight: 500;
              }

              .node-status {
                font-size: 12px;
                line-height: 18px;
                color: #4a4f54;
              }
            `}</style>
          </Row>
        )}
      </StatsDataConsumer>
    );
  }
}
