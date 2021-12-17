import BN from "bn.js";
import { FC } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

import { formatNEAR, showInYocto } from "./Balance";
import { TGAS } from "./Gas";

interface Props {
  gasPrice: BN;
}

const GasPrice: FC<Props> = ({ gasPrice }) => {
  let gasPricePerTeragas = new BN(gasPrice).mul(TGAS);
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
};

export default GasPrice;
