import * as React from "react";

import { Col, Row, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { styled } from "../../libraries/styles";
import { ValidationProgress } from "../../types/common";
import Term from "../utils/Term";
import {
  ValidatorNodesContentCell,
  ValidatorNodesDetailsTitle,
} from "./ValidatorRow";

const Uptime = styled(Col, {
  fontWeight: 500,
  fontSize: 14,
  color: "#72727a",
});

interface Props {
  progress: ValidationProgress;
}

const ValidatorTelemetryRow: React.FC<Props> = React.memo(({ progress }) => {
  const { t } = useTranslation();

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
        </Uptime>
      </Row>
    </ValidatorNodesContentCell>
  );
});

export default ValidatorTelemetryRow;
