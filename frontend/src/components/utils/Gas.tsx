import BN from "bn.js";

interface Props {
  gas: BN;
}

const Gas = ({ gas }: Props) => {
  return <>${gas.toString()} Gas</>;
};

export default Gas;
