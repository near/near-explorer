import React from "react";
import BN from "bn.js";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

import { formatNEAR, showInYocto } from "./Balance";
import { TGAS } from "../utils/Gas";

export default ({ gasPrice }) => {
  let TerraGas = new BN(gasPrice).mul(TGAS);
  let show = formatNEAR(TerraGas);
  let precise = showInYocto(gasPrice);
  return (
    <OverlayTrigger placement={"bottom"} overlay={<Tooltip>{precise}</Tooltip>}>
      <span>{show} Ⓝ/ Tgas</span>
    </OverlayTrigger>
  );
};
