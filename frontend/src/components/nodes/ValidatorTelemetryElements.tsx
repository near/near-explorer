import * as React from "react";

import { Trans, useTranslation } from "next-i18next";
import { Col, Row, Badge, Spinner } from "react-bootstrap";

import {
  ValidatorNodesContentCell,
  ValidatorNodesDetailsTitle,
} from "@explorer/frontend/components/nodes/ValidatorMetadataRow";
import ErrorMessage from "@explorer/frontend/components/utils/ErrorMessage";
import Term from "@explorer/frontend/components/utils/Term";
import Timer from "@explorer/frontend/components/utils/Timer";
import { useSubscription } from "@explorer/frontend/hooks/use-subscription";
import { styled } from "@explorer/frontend/libraries/styles";

const ValidatorNodesText = styled(Col, {
  fontWeight: 500,
  fontSize: 14,
  color: "#3f4045",
});

const AgentNameBadge = styled(Badge, {
  backgroundColor: "#f0f0f1",
  color: "#72727a",
  fontWeight: 500,
  fontSize: 12,
  fontFamily: '"Source Code Pro", monospace',
});

interface Props {
  accountId: string;
}

const ValidatorTelemetryRow: React.FC<Props> = React.memo(({ accountId }) => {
  const { t } = useTranslation();

  const latestBlockSub = useSubscription(["latestBlock"]);
  const telemetrySub = useSubscription(["validatorTelemetry", accountId]);

  if (telemetrySub.status === "loading" || telemetrySub.status === "idle") {
    return <Spinner animation="border" />;
  }
  if (telemetrySub.status === "error") {
    return (
      <ErrorMessage onRetry={telemetrySub.refetch}>
        {telemetrySub.error.message}
      </ErrorMessage>
    );
  }
  const telemetry = telemetrySub.data;
  if (!telemetry) {
    return (
      <ErrorMessage onRetry={telemetrySub.refetch}>
        {t("component.nodes.ValidatorTelemetryRow.noTelemetryFound")}
      </ErrorMessage>
    );
  }

  return (
    <>
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
              latestBlockSub.status !== "success"
                ? undefined
                : Math.abs(telemetry.lastHeight - latestBlockSub.data.height) >
                  1000
                ? "text-danger"
                : Math.abs(telemetry.lastHeight - latestBlockSub.data.height) >
                  50
                ? "text-warning"
                : undefined
            }
            md={3}
          >
            {telemetry.lastHeight}
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
            <Timer time={telemetry.lastSeen} />
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
            <AgentNameBadge variant="secondary">
              {telemetry.agentName}
            </AgentNameBadge>
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
            <AgentNameBadge variant="secondary">
              {`${telemetry.agentVersion}/${telemetry.agentBuild}`}
            </AgentNameBadge>
          </ValidatorNodesText>
        </Row>
      </ValidatorNodesContentCell>
    </>
  );
});

export default ValidatorTelemetryRow;
