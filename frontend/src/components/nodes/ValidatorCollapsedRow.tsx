import * as React from "react";

import {
  ValidatorTelemetry,
  ValidatorDescription,
  ValidationProgress,
} from "@explorer/common/types/procedures";
import ValidatorMetadataRow from "@explorer/frontend/components/nodes/ValidatorMetadataRow";
import ValidatorProgressElement from "@explorer/frontend/components/nodes/ValidatorProgressElement";
import { ValidatorNodesContentRow } from "@explorer/frontend/components/nodes/ValidatorRow";
import ValidatorTelemetryElements from "@explorer/frontend/components/nodes/ValidatorTelemetryElements";
import { TableCollapseRow } from "@explorer/frontend/components/utils/Table";

interface Props {
  isRowActive: boolean;
  progress?: ValidationProgress;
  telemetry?: ValidatorTelemetry;
  description?: ValidatorDescription;
}

const ValidatorCollapsedRow: React.FC<Props> = React.memo(
  ({ isRowActive, progress, telemetry, description }) => (
    <TableCollapseRow collapse={isRowActive}>
      <td colSpan={8}>
        <ValidatorNodesContentRow noGutters>
          {progress && <ValidatorProgressElement progress={progress} />}
          {telemetry && <ValidatorTelemetryElements telemetry={telemetry} />}
        </ValidatorNodesContentRow>

        <ValidatorMetadataRow description={description} />
      </td>
    </TableCollapseRow>
  )
);

export default ValidatorCollapsedRow;
