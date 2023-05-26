import * as React from "react";

import { useTranslation } from "next-i18next";
import { Col, Row, OverlayTrigger, Tooltip } from "react-bootstrap";

import { ValidationProgress } from "@/common/types/procedures";
import {
  ValidatorNodesContentCell,
  ValidatorNodesDetailsTitle,
} from "@/frontend/components/nodes/ValidatorMetadataRow";
import { Term } from "@/frontend/components/utils/Term";
import { styled } from "@/frontend/libraries/styles";

const Uptime = styled(Col, {
  fontWeight: 500,
  fontSize: 14,
  color: "#72727a",
});

interface Props {
  progress: ValidationProgress;
}

export const ValidatorProgressElement: React.FC<Props> = React.memo(
  ({ progress }) => {
    const { t } = useTranslation();

    const productivityRatio =
      (progress.blocks.produced + progress.chunks.produced) /
      (progress.blocks.total + progress.chunks.total);

    return (
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
            <OverlayTrigger
              placement="bottom"
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
              <span>{(productivityRatio * 100).toFixed(3)}%</span>
            </OverlayTrigger>
          </Uptime>
        </Row>
      </ValidatorNodesContentCell>
    );
  }
);
