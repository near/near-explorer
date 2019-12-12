/// Copied from near-wallet project:
/// https://github.com/nearprotocol/near-wallet/blob/cd32c6ef99dcbcd9e4ab96bef0e65ea25a8bb4a3/src/components/common/Balance.js

import { utils } from "nearlib";

const Balance = ({ amount }) => {
  if (!amount) {
    throw new Error("amount property should not be null");
  }
  let amountShow = convertToShow(amount);
  return <>{amountShow} Ⓝ</>;
};

const convertToShow = amount => {
  return formatNEAR(amount);
};

export const formatNEAR = amount => {
  let ret = utils.format.formatNearAmount(amount);
  if (ret.startsWith("0.00000")) {
    return "<0.00001";
  }
  return ret;
};

export default Balance;
