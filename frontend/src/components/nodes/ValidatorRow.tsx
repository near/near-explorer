import React from "react";
import { Row, Col, OverlayTrigger, Tooltip } from "react-bootstrap";

import { SubConsumer } from "../utils/SubscriptionProvider";
import NodesApi, * as N from "../../libraries/explorer-wamp/nodes";

import Timer from "../utils/Timer";
import Balance from "../utils/Balance";

interface Props {
  node: any;
}

interface State {
  nodeInfo?: N.NodeInfo;
}

export default class extends React.Component<Props, State> {
  statusIdentifier = new Map([
    ["AwaitingPeers", "Waiting for peers"],
    ["HeaderSync", "Syncing headers"],
    ["BlockSync", "Syncing blocks"],
    ["StateSync", "Syncing state"],
    ["StateSyncDone", "State sync is done"],
    ["BodySync", "Syncing body"],
    ["NoSync", ""],
  ]);

  state: State = {};

  queryNodeInfo = async () => {
    let nodeInfo = await new NodesApi().getValidatingInfo(
      this.props.node.account_id
    );
    this.setState({ nodeInfo });
  };

  componentDidMount() {
    this.queryNodeInfo();
  }

  render() {
    const { node } = this.props;
    const { nodeInfo } = this.state;
    return (
      <SubConsumer>
        {(context) => (
          <Row className="node-row mx-0">
            <Col md="auto" xs="1" className="pr-0">
              {node.new ? (
                <OverlayTrigger
                  placement={"right"}
                  overlay={
                    <Tooltip id="new">
                      next epoch upcoming validating nodes
                    </Tooltip>
                  }
                >
                  <img
                    src={"/static/images/icon-m-node-new.svg"}
                    style={{ width: "15px" }}
                  />
                </OverlayTrigger>
              ) : node.removed ? (
                <OverlayTrigger
                  placement={"right"}
                  overlay={
                    <Tooltip id="kickout">next epoch kick out nodes</Tooltip>
                  }
                >
                  <img
                    src={"/static/images/icon-m-node-kickout.svg"}
                    style={{ width: "15px" }}
                  />
                </OverlayTrigger>
              ) : (
                <OverlayTrigger
                  placement={"right"}
                  overlay={
                    <Tooltip id="current">current validating nodes</Tooltip>
                  }
                >
                  <img
                    src={"/static/images/icon-m-node-validating.svg"}
                    style={{ width: "15px" }}
                  />
                </OverlayTrigger>
              )}
            </Col>
            <Col md="7" xs="7">
              <Row>
                <Col className="node-row-title">
                  @{node.account_id}
                  {"   "}
                  <span>
                    Staking {node.stake ? <Balance amount={node.stake} /> : "-"}
                  </span>
                  <span className="node-status">
                    {" "}
                    {nodeInfo && this.statusIdentifier.get(nodeInfo.status)}
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
                      {nodeInfo &&
                        `${nodeInfo.agentName} | ver.${nodeInfo.agentVersion} build  ${nodeInfo.agentBuild}`}
                    </Col>
                    {nodeInfo && (
                      <Col
                        className={
                          Math.abs(
                            nodeInfo.lastHeight -
                              context.dashState.lastBlockHeight
                          ) > 1000
                            ? "text-danger"
                            : Math.abs(
                                nodeInfo.lastHeight -
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
                        {` ${nodeInfo.lastHeight}`}
                      </Col>
                    )}

                    <Col>
                      <img
                        src="/static/images/icon-storage.svg"
                        style={{ width: "12px" }}
                      />
                      {node.num_produced_blocks && node.num_expected_blocks
                        ? `${node.num_produced_blocks}/${
                            node.num_expected_blocks
                          } (${(
                            (node.num_produced_blocks /
                              node.num_expected_blocks) *
                            100
                          ).toFixed(3)})%`
                        : null}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            {nodeInfo && (
              <Col md="3" xs="3" className="ml-auto text-right">
                <Row>
                  <Col className="node-row-txid" title={nodeInfo.nodeId}>
                    {nodeInfo.nodeId.substring(8, 20)}...
                  </Col>
                </Row>
                <Row>
                  <Col className="node-row-timer">
                    <span className="node-row-timer-status">Last seen</span>
                    &nbsp;&nbsp;
                    <Timer time={nodeInfo.lastSeen} />
                  </Col>
                </Row>
              </Col>
            )}

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
      </SubConsumer>
    );
  }
}
