import { PureComponent } from "react";

import { Badge, Row, Col } from "react-bootstrap";
import { Translate } from "react-localize-redux";
import { DatabaseConsumer } from "../../context/DatabaseProvider";
import Term from "../utils/Term";
import Timer from "../utils/Timer";

interface Props {
  producedBlocks?: number;
  expectedBlocks?: number;
  latestProducedValidatorBlock?: number;
  lastSeen?: number;
  agentName?: string;
  agentVersion?: string;
  agentBuild?: string;
}

class ValidatorTelemetryRow extends PureComponent<Props> {
  render() {
    const {
      producedBlocks,
      expectedBlocks,
      latestProducedValidatorBlock,
      lastSeen,
      agentName,
      agentVersion,
      agentBuild,
    } = this.props;

    const isTelemetryAvailable =
      Boolean(producedBlocks) ||
      Boolean(expectedBlocks) ||
      Boolean(latestProducedValidatorBlock) ||
      Boolean(lastSeen) ||
      Boolean(agentName) ||
      Boolean(agentVersion) ||
      Boolean(agentBuild);

    if (isTelemetryAvailable) return null;

    return (
      <Translate>
        {({ translate }) => (
          <>
            <DatabaseConsumer>
              {({ latestBlockHeight }) => (
                <Row noGutters className="validator-nodes-content-row">
                  {producedBlocks && expectedBlocks && (
                    <Col className="validator-nodes-content-cell">
                      <Row noGutters>
                        <Col className="validator-nodes-details-title">
                          <Term
                            title={translate(
                              "component.nodes.ValidatorTelemetryRow.uptime.title"
                            )}
                            text={translate(
                              "component.nodes.ValidatorTelemetryRow.uptime.text"
                            )}
                            href="https://nomicon.io/Economics/README.html#rewards-calculation"
                          />
                        </Col>
                      </Row>
                      <Row noGutters>
                        <Col className="validator-nodes-text uptime">
                          {producedBlocks !== undefined &&
                          expectedBlocks !== undefined ? (
                            <>
                              {(
                                (producedBlocks / expectedBlocks) *
                                100
                              ).toFixed(3)}
                              % &nbsp;
                              <span>
                                ({producedBlocks}/{expectedBlocks})
                              </span>
                            </>
                          ) : null}
                        </Col>
                      </Row>
                    </Col>
                  )}
                  {latestProducedValidatorBlock && (
                    <Col className="validator-nodes-content-cell">
                      <Row noGutters>
                        <Col className="validator-nodes-details-title">
                          <Term
                            title={translate(
                              "component.nodes.ValidatorTelemetryRow.latest_produced_block.title"
                            )}
                            text={translate(
                              "component.nodes.ValidatorTelemetryRow.latest_produced_block.text"
                            )}
                          />
                        </Col>
                      </Row>
                      <Row noGutters>
                        <Col
                          className={`${
                            typeof latestBlockHeight === "undefined"
                              ? ""
                              : Math.abs(
                                  latestProducedValidatorBlock -
                                    latestBlockHeight.toNumber()
                                ) > 1000
                              ? "text-danger"
                              : Math.abs(
                                  latestProducedValidatorBlock -
                                    latestBlockHeight.toNumber()
                                ) > 50
                              ? "text-warning"
                              : ""
                          } validator-nodes-text`}
                          md={3}
                        >
                          {` ${latestProducedValidatorBlock}`}
                        </Col>
                      </Row>
                    </Col>
                  )}
                  {lastSeen && (
                    <Col className="validator-nodes-content-cell">
                      <Row noGutters>
                        <Col className="validator-nodes-details-title">
                          <Term
                            title={translate(
                              "component.nodes.ValidatorTelemetryRow.latest_telemetry_update.title"
                            )}
                            text={translate(
                              "component.nodes.ValidatorTelemetryRow.latest_telemetry_update.text"
                            )}
                          />
                        </Col>
                      </Row>
                      <Row noGutters>
                        <Col className="validator-nodes-text">
                          {lastSeen ? <Timer time={lastSeen} /> : "..."}
                        </Col>
                      </Row>
                    </Col>
                  )}
                  {agentName && (
                    <Col className="validator-nodes-content-cell">
                      <Row noGutters>
                        <Col className="validator-nodes-details-title">
                          <Term
                            title={translate(
                              "component.nodes.ValidatorTelemetryRow.agent_name.title"
                            )}
                            text={translate(
                              "component.nodes.ValidatorTelemetryRow.node_agent_name.text"
                            )}
                          />
                        </Col>
                      </Row>
                      <Row noGutters>
                        <Col>
                          {agentName ? (
                            <Badge
                              variant="secondary"
                              className="agent-name-badge"
                            >
                              {agentName}
                            </Badge>
                          ) : (
                            "..."
                          )}
                        </Col>
                      </Row>
                    </Col>
                  )}
                  {agentVersion && agentBuild && (
                    <Col className="validator-nodes-content-cell">
                      <Row noGutters>
                        <Col className="validator-nodes-details-title">
                          {translate(
                            "component.nodes.ValidatorTelemetryRow.node_agent_version_or_build.title"
                          )}
                        </Col>
                      </Row>
                      <Row noGutters>
                        <Col>
                          {agentVersion && agentBuild ? (
                            <Badge
                              variant="secondary"
                              className="agent-name-badge"
                            >
                              {`v${agentVersion} / ${agentBuild}`}
                            </Badge>
                          ) : (
                            "..."
                          )}
                        </Col>
                      </Row>
                    </Col>
                  )}
                </Row>
              )}
            </DatabaseConsumer>
          </>
        )}
      </Translate>
    );
  }
}

export default ValidatorTelemetryRow;
