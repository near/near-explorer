import * as React from "react";

import {
  ValidatorDescription,
  ValidationProgress,
} from "@/common/types/procedures";
import ValidatorMetadataRow, {
  ValidatorNodesContentRow,
} from "@/frontend/components/nodes/ValidatorMetadataRow";
import ValidatorProgressElement from "@/frontend/components/nodes/ValidatorProgressElement";
import ValidatorTelemetryElements from "@/frontend/components/nodes/ValidatorTelemetryElements";
import { TableCollapseRow } from "@/frontend/components/utils/Table";

interface Props {
  accountId: string;
  isRowActive: boolean;
  progress?: ValidationProgress;
  description?: ValidatorDescription;
}

const ValidatorCollapsedRow: React.FC<Props> = React.memo(
  ({ isRowActive, progress, description, accountId }) => (
    <TableCollapseRow collapse={isRowActive}>
      <td colSpan={8}>
        <ValidatorNodesContentRow noGutters>
          {progress && <ValidatorProgressElement progress={progress} />}
          <ValidatorTelemetryElements accountId={accountId} />
        </ValidatorNodesContentRow>

        <ValidatorMetadataRow description={description} />
      </td>
    </TableCollapseRow>
  )
);

export default ValidatorCollapsedRow;
