import React from "react";
import BN from "bn.js";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

import { formatNEAR, showInYocto } from "./Balance";
import { TGAS } from "../utils/Gas";

const GasPrice = ({ gasPrice }) => {
  let gasPricePerTeragas = new BN(gasPrice).mul(TGAS);
  return (
    <OverlayTrigger
      placement={"bottom"}
      overlay={<Tooltip>{showInYocto(gasPrice)}/gas</Tooltip>}
    >
      <span>{formatNEAR(gasPricePerTeragas)} Ⓝ/Tgas</span>
    </OverlayTrigger>
  );
};

export default GasPrice;
