/// Copied from near-wallet project:
import { utils } from "near-api-js";

export default ({ amount }) => {
  if (!amount) {
    throw new Error("amount property should not be null");
  }

  let amountShow = formatNEAR(amount);
  return <span>{amountShow} Ⓝ</span>;
};

const formatNEAR = (amount) => {
  return utils.format.formatNearAmount(amount.toString(), 0);
};
