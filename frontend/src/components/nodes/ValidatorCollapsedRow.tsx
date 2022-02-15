import React, { FC } from "react";

import { TableCollapseRow } from "../utils/Table";

import ValidatorMetadataRow from "./ValidatorMetadataRow";
import ValidatorTelemetryRow from "./ValidatorTelemetryRow";

interface Props {
  isRowActive: boolean;
  producedBlocks?: number;
  expectedBlocks?: number;
  latestProducedValidatorBlock?: number;
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

const ValidatorCollapsedRow: FC<Props> = ({
  isRowActive,
  producedBlocks,
  expectedBlocks,
  latestProducedValidatorBlock,
  lastSeen,
  agentName,
  agentVersion,
  agentBuild,
  poolWebsite,
  poolEmail,
  poolTwitter,
  poolDiscord,
  poolDescription,
}) => (
  <TableCollapseRow collapse={isRowActive}>
    <td colSpan={8}>
      <ValidatorTelemetryRow
        producedBlocks={producedBlocks}
        expectedBlocks={expectedBlocks}
        latestProducedValidatorBlock={latestProducedValidatorBlock}
        lastSeen={lastSeen}
        agentName={agentName}
        agentVersion={agentVersion}
        agentBuild={agentBuild}
      />

      <ValidatorMetadataRow
        poolWebsite={poolWebsite}
        poolEmail={poolEmail}
        poolTwitter={poolTwitter}
        poolDiscord={poolDiscord}
        poolDescription={poolDescription}
      />
    </td>
  </TableCollapseRow>
);

export default ValidatorCollapsedRow;
