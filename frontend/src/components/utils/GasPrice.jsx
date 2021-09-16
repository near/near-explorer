import { OverlayTrigger, Tooltip } from "react-bootstrap";

import { formatNEAR, showInYocto } from "./Balance";

const GasPrice = ({ gasPrice }) => {
  return (
    <OverlayTrigger
      placement={"bottom"}
      overlay={<Tooltip>{showInYocto(gasPrice)}/Gas</Tooltip>}
    >
      <span>{formatNEAR(gasPrice)} Ⓝ/Gas</span>
    </OverlayTrigger>
  );
};

export default GasPrice;
