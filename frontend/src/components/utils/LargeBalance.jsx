/// Copied from near-wallet project:
import { utils } from "near-api-js";

export default ({ amount }) => {
  console.log(amount);
  if (!amount) {
    throw new Error("amount property should not be null");
  }

  let amountShow = formatNEAR(amount);
  return <span>{amountShow} Ⓝ</span>;
};

const formatNEAR = (amount) => {
  let ret = utils.format.formatNearAmount(amount.toString(), 0);
  return ret;
};
