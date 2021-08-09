import { PureComponent } from "react";

import { Badge, Row, Col } from "react-bootstrap";
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
      <DatabaseConsumer>
        {({ latestBlockHeight }) => (
          <Row noGutters className="validator-nodes-content-row">
            {producedBlocks && expectedBlocks && (
              <Col className="validator-nodes-content-cell">
                <Row noGutters>
                  <Col className="validator-nodes-details-title">
                    <Term
                      title={"Uptime"}
                      text={
                        "Uptime is estimated by the ratio of the number of produced blocks to the number of expected blocks"
                      }
                      href="https://nomicon.io/Economics/README.html#rewards-calculation"
                    />
                  </Col>
                </Row>
                <Row noGutters>
                  <Col className="validator-nodes-text uptime">
                    {producedBlocks && expectedBlocks ? (
                      <>
                        {((producedBlocks / expectedBlocks) * 100).toFixed(3)}%
                        &nbsp;
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
                      title={"Latest block"}
                      text={
                        "The block height the validation node reported in the most recent telemetry heartbeat."
                      }
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
                      title={"Latest Telemetry Update"}
                      text={
                        "Telemetry is a regular notification coming from the nodes which includes generic information like the latest known block height, and the version of NEAR Protocol agent (nearcore)."
                      }
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
                      title={"Node Agent Name"}
                      text={
                        <>
                          {
                            "NEAR Protocol could have multiple implementations, so agent is the name of that implementation, where 'near-rs' is "
                          }
                          <a href="https://github.com/near/nearcore">
                            {"the official implementation"}
                          </a>
                          {"."}
                        </>
                      }
                    />
                  </Col>
                </Row>
                <Row noGutters>
                  <Col>
                    {agentName ? (
                      <Badge variant="secondary" className="agent-name-badge">
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
                    {"Node Agent Version / Build"}
                  </Col>
                </Row>
                <Row noGutters>
                  <Col>
                    {agentVersion && agentBuild ? (
                      <Badge variant="secondary" className="agent-name-badge">
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
    );
  }
}

export default ValidatorTelemetryRow;
