import * as React from "react";

import { TableCollapseRow } from "../utils/Table";

import ValidatorMetadataRow from "./ValidatorMetadataRow";
import ValidatorProgressElement from "./ValidatorProgressElement";
import ValidatorTelemetryElements from "./ValidatorTelemetryElements";
import {
  ValidatorTelemetry,
  ValidatorDescription,
  ValidationProgress,
} from "../../libraries/wamp/types";
import { ValidatorNodesContentRow } from "./ValidatorRow";

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
