import BN from "bn.js";

interface Props {
  gas: BN;
}

const MGAS = new BN(10 ** 6);
const TGAS = new BN(10 ** 12);

export default ({ gas }: Props) => {
  let gasShow;
  if (gas > TGAS) {
    const tgas = gas.div(TGAS).toString();
    gasShow = `${tgas} Tgas`;
  } else if (gas > MGAS) {
    const mgas = gas.div(MGAS).toString();
    gasShow = `${mgas} Mgas`;
  } else {
    gasShow = gas.toString();
  }
  return <>{gasShow}</>;
};
