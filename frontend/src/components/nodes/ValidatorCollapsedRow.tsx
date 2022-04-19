import * as React from "react";

import { TableCollapseRow } from "../utils/Table";

import ValidatorMetadataRow from "./ValidatorMetadataRow";
import ValidatorTelemetryRow from "./ValidatorTelemetryRow";
import {
  NodeInfo,
  PoolDetails,
  ValidationProgress,
} from "../../libraries/wamp/types";

interface Props {
  isRowActive: boolean;
  progress?: ValidationProgress;
  nodeInfo?: NodeInfo;
  poolDetails?: PoolDetails;
}

const ValidatorCollapsedRow: React.FC<Props> = React.memo(
  ({ isRowActive, progress, nodeInfo, poolDetails }) => (
    <TableCollapseRow collapse={isRowActive}>
      <td colSpan={8}>
        <ValidatorTelemetryRow progress={progress} nodeInfo={nodeInfo} />

        <ValidatorMetadataRow poolDetails={poolDetails} />
      </td>
    </TableCollapseRow>
  )
);

export default ValidatorCollapsedRow;
