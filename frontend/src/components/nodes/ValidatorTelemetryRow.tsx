import { FC } from "react";

import { Col, Row, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Trans, useTranslation } from "react-i18next";
import { useLatestBlockHeight } from "../../hooks/data";
import { styled } from "../../libraries/styles";
import Term from "../utils/Term";
import Timer from "../utils/Timer";
import { AgentNameBadge } from "./NodeRow";
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

interface Props {
  producedBlocks?: number;
  expectedBlocks?: number;
  producedChunks?: number;
  expectedChunks?: number;
  latestProducedValidatorBlock?: number;
  lastSeen?: number;
  agentName?: string;
  agentVersion?: string;
  agentBuild?: string;
}

const ValidatorTelemetryRow: FC<Props> = ({
  producedBlocks,
  expectedBlocks,
  producedChunks,
  expectedChunks,
  latestProducedValidatorBlock,
  lastSeen,
  agentName,
  agentVersion,
  agentBuild,
}) => {
  const { t } = useTranslation();
  const isTelemetryAvailable =
    Boolean(producedBlocks) ||
    Boolean(expectedBlocks) ||
    Boolean(producedChunks) ||
    Boolean(expectedChunks) ||
    Boolean(latestProducedValidatorBlock) ||
    Boolean(lastSeen) ||
    Boolean(agentName) ||
    Boolean(agentVersion) ||
    Boolean(agentBuild);

  const latestBlockHeight = useLatestBlockHeight();
  const producedBlocksAndChunks =
    producedBlocks !== undefined &&
    expectedBlocks !== undefined &&
    producedChunks !== undefined &&
    expectedChunks !== undefined &&
    expectedBlocks !== 0;

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
            {producedBlocksAndChunks ? (
              <>
                <OverlayTrigger
                  placement={"bottom"}
                  overlay={
                    <Tooltip id="produced-blocks-chunks">
                      {t(
                        "component.nodes.ValidatorTelemetryRow.produced_blocks_and_chunks",
                        {
                          num_produced_blocks: producedBlocks,
                          num_expected_blocks: expectedBlocks,
                          num_produced_chunks: producedChunks,
                          num_expected_chunks: expectedChunks,
                        }
                      )}
                    </Tooltip>
                  }
                >
                  <span>
                    {((producedBlocks / expectedBlocks) * 100).toFixed(3)}%
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
                    latestProducedValidatorBlock - latestBlockHeight.toNumber()
                  ) > 1000
                ? "text-danger"
                : Math.abs(
                    latestProducedValidatorBlock - latestBlockHeight.toNumber()
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
                    nearCoreLink: <a href="https://github.com/near/nearcore" />,
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
};

export default ValidatorTelemetryRow;
