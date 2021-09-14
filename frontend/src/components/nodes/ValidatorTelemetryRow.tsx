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

    if (!isTelemetryAvailable) return null;

    return (
      <Translate>
        {({ translate }) => (
          <>
            <DatabaseConsumer>
              {({ latestBlockHeight }) => (
                <Row noGutters className="validator-nodes-content-row">
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
                            {((producedBlocks / expectedBlocks) * 100).toFixed(
                              3
                            )}
                            % &nbsp;
                            <span>
                              ({producedBlocks}/{expectedBlocks})
                            </span>
                          </>
                        ) : (
                          "N/A"
                        )}
                      </Col>
                    </Row>
                  </Col>

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
                          typeof latestBlockHeight === "undefined" ||
                          latestProducedValidatorBlock === undefined
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
                        {` ${latestProducedValidatorBlock ?? "N/A"}`}
                      </Col>
                    </Row>
                  </Col>

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
                        {lastSeen ? <Timer time={lastSeen} /> : "N/A"}
                      </Col>
                    </Row>
                  </Col>

                  <Col className="validator-nodes-content-cell">
                    <Row noGutters>
                      <Col className="validator-nodes-details-title">
                        <Term
                          title={translate(
                            "component.nodes.ValidatorTelemetryRow.node_agent_name.title"
                          )}
                          text={translate(
                            "component.nodes.ValidatorTelemetryRow.node_agent_name.text",
                            {
                              agent_name_url: (
                                <a href="https://github.com/near/nearcore">
                                  {translate(
                                    "component.nodes.ValidatorTelemetryRow.node_agent_name.url_text"
                                  )}
                                </a>
                              ),
                            }
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
                          "N/A"
                        )}
                      </Col>
                    </Row>
                  </Col>

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
                        {agentVersion || agentBuild ? (
                          <Badge
                            variant="secondary"
                            className="agent-name-badge"
                          >
                            <>
                              {!agentVersion
                                ? "-"
                                : // 'agentVersion' of some validators may be string-like only
                                agentVersion && /[0-9]/.test(agentVersion)
                                ? `v${agentVersion}`
                                : agentVersion}{" "}
                              / {agentBuild ? `${agentBuild}` : "-"}
                            </>
                          </Badge>
                        ) : (
                          "N/A"
                        )}
                      </Col>
                    </Row>
                  </Col>
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
