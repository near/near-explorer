import JSBI from "jsbi";
import * as React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

import { formatNEAR, showInYocto } from "./Balance";
import { TGAS } from "./Gas";

interface Props {
  gasPrice: JSBI;
}

const GasPrice: React.FC<Props> = React.memo(({ gasPrice }) => {
  let gasPricePerTeragas = JSBI.multiply(gasPrice, TGAS);
  return (
    <OverlayTrigger
      placement={"bottom"}
      overlay={
        <Tooltip id="gas-price">{showInYocto(gasPrice.toString())}/gas</Tooltip>
      }
    >
      <span>{formatNEAR(gasPricePerTeragas)} Ⓝ/Tgas</span>
    </OverlayTrigger>
  );
});

export default GasPrice;
