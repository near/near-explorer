import * as React from "react";

import { Col, Row, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Trans, useTranslation } from "react-i18next";
import { useLatestBlockHeight } from "../../hooks/data";
import { styled } from "../../libraries/styles";
import { NodeInfo, ValidationProgress } from "../../libraries/wamp/types";
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
  progress?: ValidationProgress;
  nodeInfo?: NodeInfo;
}

const ValidatorTelemetryRow: React.FC<Props> = React.memo(
  ({ progress, nodeInfo }) => {
    const { t } = useTranslation();
    const isTelemetryAvailable = Boolean(progress) || Boolean(nodeInfo);

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
                latestBlockHeight === undefined || !nodeInfo
                  ? undefined
                  : Math.abs(
                      nodeInfo.lastHeight - latestBlockHeight.toNumber()
                    ) > 1000
                  ? "text-danger"
                  : Math.abs(
                      nodeInfo.lastHeight - latestBlockHeight.toNumber()
                    ) > 50
                  ? "text-warning"
                  : undefined
              }
              md={3}
            >
              {nodeInfo ? nodeInfo.lastHeight : t("common.state.not_available")}
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
              {nodeInfo ? (
                <Timer time={nodeInfo.lastSeen} />
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
              {nodeInfo ? (
                <AgentNameBadge variant="secondary">
                  {nodeInfo.agentName}
                </AgentNameBadge>
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
              {nodeInfo ? (
                <AgentNameBadge variant="secondary">
                  {`${nodeInfo.agentVersion ?? "-"}
                              /
                              ${nodeInfo.agentBuild ?? "-"}
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
