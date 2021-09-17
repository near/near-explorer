import BN from "bn.js";

interface Props {
  gas: BN;
}

const MGAS = new BN(10 ** 6);
const GGAS = new BN(1000).mul(MGAS);
export const TGAS = new BN(1000).mul(GGAS);
const PGAS = new BN(1000).mul(TGAS);
const EGAS = new BN(1000).mul(PGAS);

const Gas = ({ gas }: Props) => {
  let gasShow;
  if (gas.gte(EGAS)) {
    gasShow = `${gas.div(EGAS).toString()} Egas`;
  } else if (gas.gte(PGAS)) {
    gasShow = `${gas.div(PGAS).toString()} Pgas`;
  } else if (gas.gte(TGAS)) {
    gasShow = `${gas.div(TGAS).toString()} Tgas`;
  } else if (gas.gte(GGAS)) {
    gasShow = `${gas.div(GGAS).toString()} Ggas`;
  } else if (gas.gte(MGAS)) {
    gasShow = `${gas.div(MGAS).toString()} Mgas`;
  } else {
    gasShow = `${gas.toString()} gas`;
  }
  return <>{gasShow}</>;
};

export default Gas;
