import BN from "bn.js";
import React from "react";

import {
  Badge,
  Row,
  Col,
  Spinner,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { countries } from "country-data";

import { DatabaseConsumer } from "../../context/DatabaseProvider";
import * as N from "../../libraries/explorer-wamp/nodes";

import Balance from "../utils/Balance";
import { TableRow, TableCollapseRow } from "../utils/Table";
import Term from "../utils/Term";
import Timer from "../utils/Timer";
import CountryFlag from "../utils/CountryFlag";
import ValidatingLabel from "./ValidatingLabel";
import CumulativeStakeChart from "./CumulativeStakeChart";

import { Translate } from "react-localize-redux";

interface Props {
  node: N.ValidationNodeInfo;
  index: number;
  cellCount: number;
  totalStake?: BN;
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
    const { node, index, cellCount, totalStake } = this.props;
    let persntStake = 0;
    let cumulativeStake = 0;
    let validatorFee =
      typeof node.fee === "undefined"
        ? null
        : node.fee === null
        ? "N/A"
        : `${((node.fee.numerator / node.fee.denominator) * 100).toFixed(0)}%`;
    let validatorDelegators =
      typeof node.delegatorsCount === "undefined"
        ? null
        : node.delegatorsCount === null
        ? "N/A"
        : node.delegatorsCount;
    const nodeProduceBlocks =
      node.num_produced_blocks && node.num_expected_blocks;
    const poolDetailsAvailable = [
      "url",
      "email",
      "twitter",
      "discord",
      "description",
    ].some(
      (key) => node.poolDetails && Object.keys(node.poolDetails).includes(key)
    );
    // compute increaced stake of validator in the next epoch
    const stakeProposed =
      node.stakeProposed &&
      (new BN(node.stake).gt(new BN(node.stakeProposed))
        ? {
            value: new BN(node.stake)
              .sub(new BN(node.stakeProposed))
              .toString(),
            increace: false,
          }
        : new BN(node.stake).lt(new BN(node.stakeProposed))
        ? {
            value: new BN(node.stakeProposed)
              .sub(new BN(node.stake))
              .toString(),
            increace: true,
          }
        : "same");

    if (node.stake && totalStake) {
      persntStake =
        new BN(node.stake).mul(new BN(10000)).div(totalStake).toNumber() / 100;
    }

    if (node.stake && totalStake && node?.cumulativeStakeAmount) {
      cumulativeStake =
        new BN(node.cumulativeStakeAmount)
          .mul(new BN(10000))
          .div(totalStake)
          .toNumber() / 100;
    }

    return (
      <Translate>
        {({ translate }) => (
          <>
            <DatabaseConsumer>
              {(context) => (
                <>
                  <TableRow
                    className="validator-nodes-row mx-0"
                    collapse={this.state.activeRow}
                    key={node.account_id}
                  >
                    <td
                      className="collapse-row-arrow"
                      onClick={this.handleClick}
                    >
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
                    <td className="country-flag">
                      <OverlayTrigger
                        overlay={
                          <Tooltip
                            id={`${node.poolDetails?.country_code}_${index}`}
                          >
                            {node.poolDetails?.country_code &&
                            typeof node.poolDetails?.country_code !== undefined
                              ? countries[
                                  node.poolDetails?.country_code?.toUpperCase()
                                ].name
                              : node.poolDetails?.country}
                          </Tooltip>
                        }
                      >
                        <CountryFlag
                          countryCode={node.poolDetails?.country_code}
                        />
                      </OverlayTrigger>
                    </td>

                    <td>
                      <Row noGutters className="align-items-center">
                        <Col xs="2" className="validators-node-label">
                          {node.validatorStatus === "proposal" ? (
                            <ValidatingLabel
                              type="pending"
                              text={translate(
                                "component.nodes.ValidatorRow.state.pending.text"
                              ).toString()}
                              tooltipKey="nodes"
                            >
                              {translate(
                                "component.nodes.ValidatorRow.state.pending.title"
                              )}
                            </ValidatingLabel>
                          ) : node.validatorStatus === "new" ? (
                            <ValidatingLabel
                              type="new"
                              text={translate(
                                "component.nodes.ValidatorRow.state.new.text"
                              ).toString()}
                              tooltipKey="new"
                            >
                              {translate(
                                "component.nodes.ValidatorRow.state.new.title"
                              )}
                            </ValidatingLabel>
                          ) : node.validatorStatus === "leaving" ? (
                            <ValidatingLabel
                              type="kickout"
                              text={translate(
                                "component.nodes.ValidatorRow.state.kickout.text"
                              ).toString()}
                              tooltipKey="kickout"
                            >
                              {translate(
                                "component.nodes.ValidatorRow.state.kickout.title"
                              )}
                            </ValidatingLabel>
                          ) : node.validatorStatus === "active" ? (
                            <ValidatingLabel
                              type="active"
                              text={translate(
                                "component.nodes.ValidatorRow.state.active.text"
                              ).toString()}
                              tooltipKey="current"
                            >
                              {translate(
                                "component.nodes.ValidatorRow.state.active.title"
                              )}
                            </ValidatingLabel>
                          ) : null}
                        </Col>

                        <Col className="validator-name">
                          <Row noGutters>
                            <Col
                              title={`@${node.account_id}`}
                              className="validator-nodes-text"
                            >
                              {node.account_id}
                            </Col>
                          </Row>
                          {node.public_key && (
                            <Row noGutters>
                              <Col
                                title={node.public_key}
                                className="validator-nodes-text validator-node-pub-key"
                              >
                                {node.public_key}
                              </Col>
                            </Row>
                          )}
                        </Col>
                      </Row>
                    </td>

                    <td>
                      {validatorFee ?? <Spinner animation="border" size="sm" />}
                    </td>
                    <td>
                      {validatorDelegators ?? (
                        <Spinner animation="border" size="sm" />
                      )}
                    </td>
                    <td className="text-right validator-nodes-text stake-text">
                      {node.stake ? (
                        <Balance amount={node.stake} label="NEAR" />
                      ) : (
                        "-"
                      )}
                      {stakeProposed && (
                        <>
                          <br />
                          <small>
                            {stakeProposed === "same" ? (
                              "same"
                            ) : (
                              <>
                                {stakeProposed.increace ? "+" : "-"}
                                <Balance
                                  amount={stakeProposed.value}
                                  label="NEAR"
                                />
                              </>
                            )}
                          </small>
                        </>
                      )}
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
                    <td colSpan={cellCount}>
                      <Row noGutters className="validator-nodes-content-row">
                        {node.num_produced_blocks && node.num_expected_blocks && (
                          <Col className="validator-nodes-content-cell">
                            <Row noGutters>
                              <Col className="validator-nodes-details-title">
                                <Term
                                  title={translate(
                                    "component.nodes.ValidatorRow.uptime.title"
                                  )}
                                  text={translate(
                                    "component.nodes.ValidatorRow.uptime.text"
                                  )}
                                  href="https://nomicon.io/Economics/README.html#rewards-calculation"
                                />
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
                        )}
                        {node.nodeInfo && (
                          <Col className="validator-nodes-content-cell">
                            <Row noGutters>
                              <Col className="validator-nodes-details-title">
                                <Term
                                  title={translate(
                                    "component.nodes.ValidatorRow.latest_block.title"
                                  )}
                                  text={translate(
                                    "component.nodes.ValidatorRow.latest_block.text"
                                  )}
                                />
                              </Col>
                            </Row>
                            <Row noGutters>
                              <Col
                                className={`${
                                  typeof context.latestBlockHeight ===
                                  "undefined"
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
                            </Row>
                          </Col>
                        )}
                        {node.nodeInfo?.lastSeen && (
                          <Col className="validator-nodes-content-cell">
                            <Row noGutters>
                              <Col className="validator-nodes-details-title">
                                <Term
                                  title={translate(
                                    "component.nodes.ValidatorRow.latest_telemetry_update.title"
                                  )}
                                  text={translate(
                                    "component.nodes.ValidatorRow.latest_telemetry_update.text"
                                  )}
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
                        )}
                        {node.nodeInfo?.agentName && (
                          <Col className="validator-nodes-content-cell">
                            <Row noGutters>
                              <Col className="validator-nodes-details-title">
                                <Term
                                  title={translate(
                                    "component.nodes.ValidatorRow.node_agent_name.title"
                                  )}
                                  text={translate(
                                    "component.nodes.ValidatorRow.node_agent_name.text"
                                  )}
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
                        )}
                        {node.nodeInfo?.agentVersion &&
                          node.nodeInfo?.agentBuild && (
                            <Col className="validator-nodes-content-cell">
                              <Row noGutters>
                                <Col className="validator-nodes-details-title">
                                  {translate(
                                    "component.nodes.ValidatorRow.node_agent_version_or_build.title"
                                  )}
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
                          )}
                          {node.nodeInfo?.agentVersion &&
                            node.nodeInfo?.agentBuild && (
                              <Col className="validator-nodes-content-cell">
                                <Row noGutters>
                                  <Col className="validator-nodes-details-title">
                                    {"Node Agent Version / Build"}
                                  </Col>
                                </Row>
                                <Row noGutters>
                                  <Col>
                                    {node.nodeInfo ? (
                                      <Badge
                                        variant="secondary"
                                        className="agent-name-badge"
                                      >
                                        {`v${node.nodeInfo.agentVersion} / ${node.nodeInfo.agentBuild}`}
                                      </Badge>
                                    ) : (
                                      "..."
                                    )}
                                  </Col>
                                </Row>
                              </Col>
                            )}
                        </Row>

                      <Row noGutters className="validator-nodes-content-row">
                        {node?.poolDetails && poolDetailsAvailable ? (
                          <>
                            {node.poolDetails.url && (
                              <Col
                                className="validator-nodes-content-cell"
                                xs="auto"
                              >
                                <Row noGutters>
                                  <Col className="validator-nodes-details-title">
                                    Web
                                  </Col>
                                </Row>
                                <Row noGutters>
                                  <Col className="validator-nodes-text">
                                    <a
                                      href={`http://${node.poolDetails.url}`}
                                      target="_blank"
                                    >
                                      {node.poolDetails.url}
                                    </a>
                                  </Col>
                                </Row>
                              </Col>
                            )}
                            {node.poolDetails.email && (
                              <Col
                                className="validator-nodes-content-cell"
                                xs="auto"
                              >
                                <Row noGutters>
                                  <Col className="validator-nodes-details-title">
                                    Email
                                  </Col>
                                </Row>
                                <Row noGutters>
                                  <Col className="validator-nodes-text">
                                    <a
                                      href={`mailto:${node.poolDetails.email}`}
                                    >
                                      {node.poolDetails.email}
                                    </a>
                                  </Col>
                                </Row>
                              </Col>
                            )}
                            {node.poolDetails.twitter && (
                              <Col
                                className="validator-nodes-content-cell"
                                xs="auto"
                              >
                                <Row noGutters>
                                  <Col className="validator-nodes-details-title">
                                    Twitter
                                  </Col>
                                </Row>
                                <Row noGutters>
                                  <Col className="validator-nodes-text">
                                    <a
                                      href={`https://twitter.com/${node.poolDetails.twitter}`}
                                      target="_blank"
                                    >
                                      {node.poolDetails.twitter}
                                    </a>
                                  </Col>
                                </Row>
                              </Col>
                            )}
                            {node.poolDetails.discord && (
                              <Col
                                className="validator-nodes-content-cell"
                                xs="auto"
                              >
                                <Row noGutters>
                                  <Col className="validator-nodes-details-title">
                                    Discord
                                  </Col>
                                </Row>
                                <Row noGutters>
                                  <Col className="validator-nodes-text">
                                    <a
                                      href={node.poolDetails.discord}
                                      target="_blank"
                                    >
                                      {node.poolDetails.discord}
                                    </a>
                                  </Col>
                                </Row>
                              </Col>
                            )}
                            {node.poolDetails.description && (
                              <Col className="validator-nodes-content-cell">
                                <Row noGutters>
                                  <Col className="validator-nodes-details-title">
                                    Description
                                  </Col>
                                </Row>
                                <Row noGutters>
                                  <Col className="validator-nodes-text">
                                    <small>
                                      {node.poolDetails.description}
                                    </small>
                                  </Col>
                                </Row>
                              </Col>
                            )}
                          </>
                        ) : (
                          <Col className="validator-nodes-content-cell">
                            <p className="text-center">
                              If you are node owner feel free to fill all{" "}
                              <a
                                href="https://github.com/zavodil/near-pool-details#description"
                                target="_blank"
                              >
                                data
                              </a>{" "}
                              to promote your own node!
                            </p>
                          </Col>
                        )}
                      </Row>
                    </td>
                  </TableCollapseRow>

                  {node?.cumulativeStakeAmount && node?.networkHolder && (
                    <tr className="cumulative-stake-holders-row">
                      <td
                        colSpan={cellCount}
                        className="warning-text text-center"
                      >
                        {translate("component.nodes.ValidatorRow.warning_tip", {
                          node_tip_max: index,
                        })}
                      </td>
                    </tr>
                  )}

                  <style jsx global>{`
                    @import url("https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@500&display=swap");

                    .collapse-row-arrow {
                      cursor: pointer;
                    }

                    .collapse-row-arrow.disable {
                      cursor: default;
                      opacity: 0.3;
                      pointer-events: none;
                      touch-action: none;
                    }

                    .validator-nodes-text {
                      font-weight: 500;
                      font-size: 14px;
                      color: #3f4045;
                    }

                    .validator-node-pub-key {
                      color: #2b9af4;
                    }

                    .validator-name {
                      max-width: 250px;
                    }

                    .validator-name .validator-nodes-text {
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
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

                    .validator-nodes-text.stake-text {
                      font-weight: 700;
                    }

                    .validator-nodes-content-row {
                      padding-top: 16px;
                      padding-bottom: 16px;
                    }

                    .validator-nodes-content-row
                      > .validator-nodes-content-cell {
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

                    @media (min-width: 1200px) {
                      .validator-name {
                        max-width: 370px;
                      }
                    }
                  `}</style>
                </>
              )}
            </DatabaseConsumer>
          </>
        )}
      </Translate>
    );
  }
}

export default ValidatorRow;
