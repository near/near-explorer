import * as React from "react";

import JSBI from "jsbi";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

import { formatNEAR, showInYocto } from "@/frontend/components/utils/Balance";
import { TGAS } from "@/frontend/components/utils/Gas";

interface Props {
  gasPrice: string;
}

export const GasPrice: React.FC<Props> = React.memo(({ gasPrice }) => {
  const gasPricePerTeragas = React.useMemo(
    () => JSBI.multiply(JSBI.BigInt(gasPrice), TGAS),
    [gasPrice]
  );
  return (
    <OverlayTrigger
      placement="bottom"
      overlay={
        <Tooltip id="gas-price">{showInYocto(gasPrice.toString())}/gas</Tooltip>
      }
    >
      <span>{formatNEAR(gasPricePerTeragas)} Ⓝ/Tgas</span>
    </OverlayTrigger>
  );
});
