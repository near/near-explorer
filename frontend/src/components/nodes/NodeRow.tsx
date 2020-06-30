import React from "react";
import { Row, Col } from "react-bootstrap";

import * as N from "../../libraries/explorer-wamp/nodes";
import { RpcConsumer } from "../utils/RpcProvider";

import Timer from "../utils/Timer";
import Balance from "../utils/Balance";

interface Props {
  node: N.NodeInfo;
}

export default class extends React.PureComponent<Props> {
  statusIdentifier = new Map([
    ["AwaitingPeers", "Waiting for peers"],
    ["HeaderSync", "Syncing headers"],
    ["BlockSync", "Syncing blocks"],
    ["StateSync", "Syncing state"],
    ["StateSyncDone", "State sync is done"],
    ["BodySync", "Syncing body"],
    ["NoSync", ""],
  ]);

  render() {
    const { node } = this.props;
    return (
      <RpcConsumer>
        {(context) => (
          <Row className="node-row mx-0">
            <Col md="auto" xs="1" className="pr-0">
              <img
                src={"/static/images/icon-m-node-online.svg"}
                style={{ width: "15px" }}
              />
            </Col>
            <Col md="7" xs="7">
              <Row>
                <Col className="node-row-title">
                  @{node.accountId}
                  {"   "}
                  <span>
                    Staking {node.stake && <Balance amount={node.stake} />}
                  </span>
                  <span className="node-status">
                    {" "}
                    {this.statusIdentifier.get(node.status)}
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
                        Math.abs(node.lastHeight - context.lastBlockHeight) >
                        1000
                          ? "text-danger"
                          : Math.abs(
                              node.lastHeight - context.lastBlockHeight
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
                    <Col>
                      <img
                        src="/static/images/icon-storage.svg"
                        style={{ width: "12px" }}
                      />
                      {node.producedBlocks && node.expectedBlocks
                        ? `${node.producedBlocks}/${node.expectedBlocks} (${(
                            (node.producedBlocks / node.expectedBlocks) *
                            100
                          ).toFixed(3)})%`
                        : null}
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
      </RpcConsumer>
    );
  }
}
