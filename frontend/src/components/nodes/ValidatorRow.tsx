import BN from "bn.js";
import React from "react";

import { Badge, Row, Col } from "react-bootstrap";

import { DatabaseConsumer } from "../../context/DatabaseProvider";
import * as N from "../../libraries/explorer-wamp/nodes";

import Balance from "../utils/Balance";
import { TableRow, TableCollapseRow } from "../utils/Table";
import Term from "../utils/Term";
import Timer from "../utils/Timer";
import TransactionLink from "../utils/TransactionLink";
import ValidatingLabel from "./ValidatingLabel";
import CumulativeStakeChart from "./CumuativeStakeChart";

interface Props {
  node: N.Validating;
  index: number;
  totalStake: BN;
  cumulativeStakeAmount: CumulativeStake;
}

interface CumulativeStake {
  total: BN;
  networkHolderIndex: number;
}
interface State {
  activeRow: boolean;
}

class ValidatorRow extends React.PureComponent<Props, State> {
  state = {
    activeRow: false,
  };

  handleClick = () =>
    this.setState(({ activeRow }) => ({ activeRow: !activeRow }));

  render() {
    const { node, index, totalStake, cumulativeStakeAmount } = this.props;
    let persntStake = 0;
    let cumulativeStake = 0;

    if (node.stake) {
      persntStake =
        new BN(node.stake).mul(new BN(10000)).div(totalStake).toNumber() / 100;
    }

    if (cumulativeStakeAmount) {
      cumulativeStake =
        new BN(cumulativeStakeAmount.total)
          .mul(new BN(10000))
          .div(totalStake)
          .toNumber() / 100;
    }

    return (
      <DatabaseConsumer>
        {(context) => (
          <>
            <TableRow
              className="validator-nodes-row mx-0"
              collapse={this.state.activeRow}
              key={node.account_id}
            >
              <td onClick={this.handleClick}>
                {this.state.activeRow ? (
                  <img
                    src="/static/images/icon-minimize.svg"
                    style={{ width: "16px" }}
                  />
                ) : (
                  <img
                    src="/static/images/icon-maximize.svg"
                    style={{ width: "16px" }}
                  />
                )}
              </td>

              <td className="order">{index}</td>

              <td>- -</td>

              <td>
                <Row noGutters className="align-items-center">
                  <Col xs="2" className="validators-node-label">
                    {node.new ? (
                      <ValidatingLabel
                        type="new"
                        text="next epoch upcoming validating nodes"
                        tooltipKey="new"
                      >
                        New
                      </ValidatingLabel>
                    ) : node.removed ? (
                      <ValidatingLabel
                        type="kickout"
                        text="next epoch kick out nodes"
                        tooltipKey="kickout"
                      >
                        Kickout
                      </ValidatingLabel>
                    ) : (
                      <ValidatingLabel
                        type="active"
                        text="current validating nodes"
                        tooltipKey="current"
                      >
                        Active
                      </ValidatingLabel>
                    )}
                  </Col>

                  <Col>
                    <Row noGutters>
                      <Col
                        title={`@${node.account_id}`}
                        className="validator-nodes-text"
                      >
                        {node.account_id.substring(0, 20)}...
                      </Col>
                    </Row>
                    {node.nodeInfo && (
                      <Row noGutters>
                        <Col
                          title={node.nodeInfo.nodeId}
                          className="validator-nodes-text"
                        >
                          <TransactionLink
                            transactionHash={node.nodeInfo.nodeId}
                          />
                        </Col>
                      </Row>
                    )}
                  </Col>
                </Row>
              </td>

              <td>- -</td>
              <td>- -</td>
              <td className="text-right validator-nodes-text">
                {node.stake ? <Balance amount={node.stake} /> : "-"}
              </td>
              <td>
                <CumulativeStakeChart
                  value={{
                    total: cumulativeStake - persntStake,
                    current: cumulativeStake,
                  }}
                />
              </td>
            </TableRow>

            <TableCollapseRow
              className="validator-nodes-details-row"
              collapse={this.state.activeRow}
            >
              <td colSpan={8}>
                <Row noGutters className="validator-nodes-content-row">
                  <Col xs="2" className="validator-nodes-content-cell">
                    <Row noGutters>
                      <Col className="validator-nodes-details-title">
                        <Term title={"Uptime"} text={"Uptime explain text"} />
                      </Col>
                    </Row>
                    <Row noGutters>
                      <Col className="validator-nodes-text uptime">
                        {node.num_produced_blocks &&
                        node.num_expected_blocks ? (
                          <>
                            {(
                              (node.num_produced_blocks /
                                node.num_expected_blocks) *
                              100
                            ).toFixed(3)}
                            % &nbsp;
                            <span>
                              ({node.num_produced_blocks}/
                              {node.num_expected_blocks})
                            </span>
                          </>
                        ) : null}
                      </Col>
                    </Row>
                  </Col>

                  <Col xs="2" className="validator-nodes-content-cell">
                    <Row noGutters>
                      <Col className="validator-nodes-details-title">
                        <Term
                          title={"Latest block"}
                          text={"Latest block explain text"}
                        />
                      </Col>
                    </Row>
                    <Row noGutters>
                      {node.nodeInfo && (
                        <Col
                          className={`${
                            typeof context.latestBlockHeight === "undefined"
                              ? ""
                              : Math.abs(
                                  node.nodeInfo.lastHeight -
                                    context.latestBlockHeight.toNumber()
                                ) > 1000
                              ? "text-danger"
                              : Math.abs(
                                  node.nodeInfo.lastHeight -
                                    context.latestBlockHeight.toNumber()
                                ) > 50
                              ? "text-warning"
                              : ""
                          } validator-nodes-text`}
                          md={3}
                        >
                          {` ${node.nodeInfo.lastHeight}`}
                        </Col>
                      )}
                    </Row>
                  </Col>

                  <Col xs="3" className="validator-nodes-content-cell">
                    <Row noGutters>
                      <Col className="validator-nodes-details-title">
                        <Term
                          title={"Latest Telemetry Update"}
                          text={"Latest Telemetry Update explain text"}
                        />
                      </Col>
                    </Row>
                    <Row noGutters>
                      <Col className="validator-nodes-text">
                        {node.nodeInfo ? (
                          <Timer time={node.nodeInfo.lastSeen} />
                        ) : (
                          "..."
                        )}
                      </Col>
                    </Row>
                  </Col>

                  <Col xs="2" className="validator-nodes-content-cell">
                    <Row noGutters>
                      <Col className="validator-nodes-details-title">
                        <Term
                          title={"Node Agent Name"}
                          text={"Node Agent Name explain text"}
                        />
                      </Col>
                    </Row>
                    <Row noGutters>
                      <Col>
                        {node.nodeInfo ? (
                          <Badge
                            variant="secondary"
                            className="agent-name-badge"
                          >
                            {node.nodeInfo.agentName}
                          </Badge>
                        ) : (
                          "..."
                        )}
                      </Col>
                    </Row>
                  </Col>

                  <Col xs="3" className="validator-nodes-content-cell">
                    <Row noGutters>
                      <Col className="validator-nodes-details-title">
                        <Term
                          title={"Node Agent Version / Build"}
                          text={"Node Agent Version / Build explain text"}
                        />
                      </Col>
                    </Row>
                    <Row noGutters>
                      <Col>
                        {node.nodeInfo ? (
                          <Badge
                            variant="secondary"
                            className="agent-name-badge"
                          >
                            {" "}
                            v{node.nodeInfo.agentVersion} /{" "}
                            {node.nodeInfo.agentBuild}
                          </Badge>
                        ) : (
                          "..."
                        )}
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </td>
            </TableCollapseRow>

            {cumulativeStakeAmount.networkHolderIndex + 1 === index && (
              <tr className="cumulative-stake-holders-row">
                <td colSpan={8} className="warning-text text-center">
                  Validators 1 - {cumulativeStakeAmount.networkHolderIndex + 1}{" "}
                  hold a cumulative stake above 33%. Delegating to the
                  validators below improves the decentralization of the network.
                </td>
              </tr>
            )}

            <style jsx global>{`
              @import url("https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@500&display=swap");

              .validator-nodes-text {
                font-weight: 500;
                font-size: 14px;
                color: #3f4045;
              }

              .validator-nodes-details-title {
                display: flex;
                flex-wrap: nowrap;
                font-size: 12px;
                color: #a2a2a8;
              }

              .validator-nodes-text.uptime {
                color: #72727a;
              }

              .validator-nodes-content-row {
                padding-top: 16px;
                padding-bottom: 16px;
              }

              .validator-nodes-content-row > .validator-nodes-content-cell {
                padding: 0 22px;
                border-right: 1px solid #e5e5e6;
              }

              .validator-nodes-content-row
                > .validator-nodes-content-cell:last-child {
                border-right: none;
              }

              .agent-name-badge {
                background-color: #f0f0f1;
                color: #72727a;
                font-weight: 500;
                font-size: 12px;
                font-family: "Roboto Mono", monospace;
              }

              .validators-node-label {
                margin-right: 24px;
              }

              .cumulative-stake-holders-row {
                background-color: #fff6ed;
              }
              .cumulative-stake-holders-row .warning-text {
                color: #995200;
                padding: 16px 50px;
                font-size: 12px;
              }
            `}</style>
          </>
        )}
      </DatabaseConsumer>
    );
  }
}

export default ValidatorRow;
