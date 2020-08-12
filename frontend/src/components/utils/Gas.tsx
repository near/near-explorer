import BN from "bn.js";

interface Props {
  gas: BN;
}

const MGAS = new BN(10 ** 6);
export const TGAS = new BN(10 ** 12);

export default ({ gas }: Props) => {
  let gasShow;
  if (gas.gte(TGAS)) {
    gasShow = `${gas.div(TGAS).toString()} Tgas`;
  } else if (gas.gte(MGAS)) {
    gasShow = `${gas.div(MGAS).toString()} Mgas`;
  } else {
    gasShow = `${gas.toString()} gas`;
  }
  return <>{gasShow}</>;
};
