import BN from "bn.js";

interface Props {
  gas: BN;
}

const MGAS = new BN(10 ** 6);
export const GGAS = new BN(10 ** 9);

export default ({ gas }: Props) => {
  let gasShow;
  if (gas.gte(GGAS)) {
    gasShow = `${gas.div(GGAS).toString()} Ggas`;
  } else if (gas.gte(MGAS)) {
    gasShow = `${gas.div(MGAS).toString()} Mgas`;
  } else {
    gasShow = `${gas.toString()} gas`;
  }
  return <>{gasShow}</>;
};
