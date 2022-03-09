import * as React from "react";

import { TableCollapseRow } from "../utils/Table";

import ValidatorMetadataRow from "./ValidatorMetadataRow";
import ValidatorTelemetryRow from "./ValidatorTelemetryRow";
import { ValidationProgress } from "../../libraries/wamp/types";

interface Props {
  isRowActive: boolean;
  progress?: ValidationProgress;
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

const ValidatorCollapsedRow: React.FC<Props> = ({
  isRowActive,
  progress,
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
        progress={progress}
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
