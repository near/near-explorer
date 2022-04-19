import * as React from "react";

import { Col, Row, OverlayTrigger, Tooltip, Badge } from "react-bootstrap";
import { Trans, useTranslation } from "react-i18next";
import { useLatestBlockHeight } from "../../hooks/data";
import { styled } from "../../libraries/styles";
import { ValidationProgress } from "../../libraries/wamp/types";
import Term from "../utils/Term";
import Timer from "../utils/Timer";
import {
  ValidatorNodesContentCell,
  ValidatorNodesContentRow,
  ValidatorNodesDetailsTitle,
} from "./ValidatorRow";

const ValidatorNodesText = styled(Col, {
  fontWeight: 500,
  fontSize: 14,
  color: "#3f4045",
});

const Uptime = styled(ValidatorNodesText, {
  color: "#72727a",
});

const AgentNameBadge = styled(Badge, {
  backgroundColor: "#f0f0f1",
  color: "#72727a",
  fontWeight: 500,
  fontSize: 12,
  fontFamily: '"Roboto Mono", monospace',
});

interface Props {
  progress?: ValidationProgress;
  latestProducedValidatorBlock?: number;
  lastSeen?: number;
  agentName?: string;
  agentVersion?: string;
  agentBuild?: string;
}

const ValidatorTelemetryRow: React.FC<Props> = React.memo(
  ({
    progress,
    latestProducedValidatorBlock,
    lastSeen,
    agentName,
    agentVersion,
    agentBuild,
  }) => {
    const { t } = useTranslation();
    const isTelemetryAvailable =
      Boolean(progress) ||
      Boolean(latestProducedValidatorBlock) ||
      Boolean(lastSeen) ||
      Boolean(agentName) ||
      Boolean(agentVersion) ||
      Boolean(agentBuild);

    const latestBlockHeight = useLatestBlockHeight();

    if (!isTelemetryAvailable) return null;

    return (
      <ValidatorNodesContentRow noGutters>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@500&display=swap"
          rel="stylesheet"
        />
        <ValidatorNodesContentCell>
          <Row noGutters>
            <ValidatorNodesDetailsTitle>
              <Term
                title={t("component.nodes.ValidatorTelemetryRow.uptime.title")}
                text={t("component.nodes.ValidatorTelemetryRow.uptime.text")}
                href="https://nomicon.io/Economics/README.html#rewards-calculation"
              />
            </ValidatorNodesDetailsTitle>
          </Row>
          <Row noGutters>
            <Uptime>
              {progress ? (
                <>
                  <OverlayTrigger
                    placement={"bottom"}
                    overlay={
                      <Tooltip id="produced-blocks-chunks">
                        {t(
                          "component.nodes.ValidatorTelemetryRow.produced_blocks_and_chunks",
                          {
                            num_produced_blocks: progress.blocks.produced,
                            num_expected_blocks: progress.blocks.total,
                            num_produced_chunks: progress.chunks.produced,
                            num_expected_chunks: progress.chunks.total,
                          }
                        )}
                      </Tooltip>
                    }
                  >
                    <span>
                      {(
                        (progress.blocks.produced / progress.blocks.total) *
                        100
                      ).toFixed(3)}
                      %
                    </span>
                  </OverlayTrigger>
                </>
              ) : (
                t("common.state.not_available")
              )}
            </Uptime>
          </Row>
        </ValidatorNodesContentCell>

        <ValidatorNodesContentCell>
          <Row noGutters>
            <ValidatorNodesDetailsTitle>
              <Term
                title={t(
                  "component.nodes.ValidatorTelemetryRow.latest_produced_block.title"
                )}
                text={t(
                  "component.nodes.ValidatorTelemetryRow.latest_produced_block.text"
                )}
              />
            </ValidatorNodesDetailsTitle>
          </Row>
          <Row noGutters>
            <ValidatorNodesText
              className={
                latestBlockHeight === undefined ||
                latestProducedValidatorBlock === undefined
                  ? undefined
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
                  : undefined
              }
              md={3}
            >
              {latestProducedValidatorBlock ?? t("common.state.not_available")}
            </ValidatorNodesText>
          </Row>
        </ValidatorNodesContentCell>

        <ValidatorNodesContentCell>
          <Row noGutters>
            <ValidatorNodesDetailsTitle>
              <Term
                title={t(
                  "component.nodes.ValidatorTelemetryRow.latest_telemetry_update.title"
                )}
                text={t(
                  "component.nodes.ValidatorTelemetryRow.latest_telemetry_update.text"
                )}
              />
            </ValidatorNodesDetailsTitle>
          </Row>
          <Row noGutters>
            <ValidatorNodesText>
              {lastSeen ? (
                <Timer time={lastSeen} />
              ) : (
                t("common.state.not_available")
              )}
            </ValidatorNodesText>
          </Row>
        </ValidatorNodesContentCell>

        <ValidatorNodesContentCell>
          <Row noGutters>
            <ValidatorNodesDetailsTitle>
              <Term
                title={t(
                  "component.nodes.ValidatorTelemetryRow.node_agent_name.title"
                )}
                text={
                  <Trans
                    i18nKey="component.nodes.ValidatorTelemetryRow.node_agent_name.text"
                    components={{
                      nearCoreLink: (
                        <a href="https://github.com/near/nearcore" />
                      ),
                    }}
                  />
                }
              />
            </ValidatorNodesDetailsTitle>
          </Row>
          <Row noGutters>
            <ValidatorNodesText>
              {agentName ? (
                <AgentNameBadge variant="secondary">{agentName}</AgentNameBadge>
              ) : (
                t("common.state.not_available")
              )}
            </ValidatorNodesText>
          </Row>
        </ValidatorNodesContentCell>

        <ValidatorNodesContentCell>
          <Row noGutters>
            <ValidatorNodesDetailsTitle>
              {t(
                "component.nodes.ValidatorTelemetryRow.node_agent_version_or_build.title"
              )}
            </ValidatorNodesDetailsTitle>
          </Row>
          <Row noGutters>
            <ValidatorNodesText>
              {agentVersion || agentBuild ? (
                <AgentNameBadge variant="secondary">
                  {`${agentVersion ?? "-"}
                              /
                              ${agentBuild ?? "-"}
                            `}
                </AgentNameBadge>
              ) : (
                t("common.state.not_available")
              )}
            </ValidatorNodesText>
          </Row>
        </ValidatorNodesContentCell>
      </ValidatorNodesContentRow>
    );
  }
);

export default ValidatorTelemetryRow;
