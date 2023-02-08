import * as React from "react";

import JSBI from "jsbi";

import * as BI from "@explorer/frontend/libraries/bigint";

interface Props {
  gas: JSBI;
}

const MGAS = JSBI.exponentiate(BI.ten, JSBI.BigInt(6));
const GGAS = JSBI.multiply(MGAS, JSBI.BigInt(1000));
export const TGAS = JSBI.multiply(GGAS, JSBI.BigInt(1000));

const Gas: React.FC<Props> = React.memo(({ gas }) => {
  let gasShow;
  if (JSBI.greaterThan(gas, TGAS)) {
    gasShow = `${JSBI.divide(gas, TGAS).toString()} Tgas`;
  } else if (JSBI.greaterThan(gas, GGAS)) {
    gasShow = `${JSBI.divide(gas, GGAS).toString()} Ggas`;
  } else if (JSBI.greaterThan(gas, MGAS)) {
    gasShow = `${JSBI.divide(gas, MGAS).toString()} Mgas`;
  } else {
    gasShow = `${gas.toString()} gas`;
  }
  return <>{gasShow}</>;
});

export default Gas;
