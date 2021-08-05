import React, { PureComponent } from "react";

import { Badge, Row, Col } from "react-bootstrap";

import { DatabaseConsumer } from "../../context/DatabaseProvider";

import { TableCollapseRow } from "../utils/Table";
import Term from "../utils/Term";
import Timer from "../utils/Timer";

interface Props {
  isRowActive: boolean;
  producedBlocks?: number;
  expectedBlocks?: number;
  validatorsLatestBlock?: number;
  lastSeen?: number;
  agentName?: string;
  agentVersion?: string;
  agentBuild?: string;
  poolWebsite?: string;
  poolEmail?: string;
  poolTwitter?: string;
  poolDiscord?: string;
  poolDescription?: string;
}

class ValidatorCollapsedRow extends PureComponent<Props> {
  render() {
    const {
      isRowActive,
      producedBlocks,
      expectedBlocks,
      validatorsLatestBlock,
      lastSeen,
      agentName,
      agentVersion,
      agentBuild,
      poolWebsite,
      poolEmail,
      poolTwitter,
      poolDiscord,
      poolDescription,
    } = this.props;

    const poolDetailsAvailable =
      Boolean(poolWebsite) ||
      Boolean(poolEmail) ||
      Boolean(poolTwitter) ||
      Boolean(poolDiscord) ||
      Boolean(poolDescription);

    return (
      <DatabaseConsumer>
        {({ latestBlockHeight }) => (
          <>
            <TableCollapseRow
              className="validator-nodes-details-row"
              collapse={isRowActive}
            >
              <td colSpan={8}>
                {producedBlocks && expectedBlocks && (
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
                    {validatorsLatestBlock && (
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
                                    validatorsLatestBlock -
                                      latestBlockHeight.toNumber()
                                  ) > 1000
                                ? "text-danger"
                                : Math.abs(
                                    validatorsLatestBlock -
                                      latestBlockHeight.toNumber()
                                  ) > 50
                                ? "text-warning"
                                : ""
                            } validator-nodes-text`}
                            md={3}
                          >
                            {` ${validatorsLatestBlock}`}
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
                            {"Node Agent Version / Build"}
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

                <Row noGutters className="validator-nodes-content-row">
                  {poolDetailsAvailable ? (
                    <>
                      {poolWebsite && (
                        <Col className="validator-nodes-content-cell" xs="auto">
                          <Row noGutters>
                            <Col className="validator-nodes-details-title">
                              Web
                            </Col>
                          </Row>
                          <Row noGutters>
                            <Col className="validator-nodes-text">
                              <a
                                href={`http://${poolWebsite}`}
                                rel="noreferrer noopener"
                                target="_blank"
                              >
                                {poolWebsite}
                              </a>
                            </Col>
                          </Row>
                        </Col>
                      )}
                      {poolEmail && (
                        <Col className="validator-nodes-content-cell" xs="auto">
                          <Row noGutters>
                            <Col className="validator-nodes-details-title">
                              Email
                            </Col>
                          </Row>
                          <Row noGutters>
                            <Col className="validator-nodes-text">
                              <a href={`mailto:${poolEmail}`}>{poolEmail}</a>
                            </Col>
                          </Row>
                        </Col>
                      )}
                      {poolTwitter && (
                        <Col className="validator-nodes-content-cell" xs="auto">
                          <Row noGutters>
                            <Col className="validator-nodes-details-title">
                              Twitter
                            </Col>
                          </Row>
                          <Row noGutters>
                            <Col className="validator-nodes-text">
                              <a
                                href={`https://twitter.com/${poolTwitter}`}
                                rel="noreferrer noopener"
                                target="_blank"
                              >
                                {poolTwitter}
                              </a>
                            </Col>
                          </Row>
                        </Col>
                      )}
                      {poolDiscord && (
                        <Col className="validator-nodes-content-cell" xs="auto">
                          <Row noGutters>
                            <Col className="validator-nodes-details-title">
                              Discord
                            </Col>
                          </Row>
                          <Row noGutters>
                            <Col className="validator-nodes-text">
                              <a
                                href={poolDiscord}
                                rel="noreferrer noopener"
                                target="_blank"
                              >
                                {poolDiscord}
                              </a>
                            </Col>
                          </Row>
                        </Col>
                      )}
                      {poolDescription && (
                        <Col className="validator-nodes-content-cell">
                          <Row noGutters>
                            <Col className="validator-nodes-details-title">
                              Description
                            </Col>
                          </Row>
                          <Row noGutters>
                            <Col className="validator-nodes-text">
                              <small>{poolDescription}</small>
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
          </>
        )}
      </DatabaseConsumer>
    );
  }
}

export default ValidatorCollapsedRow;
