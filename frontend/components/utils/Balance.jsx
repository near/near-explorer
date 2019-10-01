/// Copied from near-wallet project:
/// https://github.com/nearprotocol/near-wallet/blob/cd32c6ef99dcbcd9e4ab96bef0e65ea25a8bb4a3/src/components/common/Balance.js

// denomination of one near in minimal non divisible units (attoNears)
// NEAR_NOMINATION is 10 ** 18 one unit
export const NOMINATION = 18;
const REG = /(?=(\B)(\d{3})+$)/g;

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
  if (amount.length < NOMINATION - 5) {
    return "<0.00001";
  } else if (amount.length <= NOMINATION) {
    let zeros = "0".repeat(NOMINATION);
    return "0." + (zeros.substring(amount.length) + amount).slice(0, 5);
  } else {
    let len = amount.length - NOMINATION;
    let numInt =
      len > 3 ? amount.slice(0, len).replace(REG, ",") : amount.slice(0, len);
    let numDec = amount.slice(len, amount.length);
    return numInt + "." + numDec.slice(0, 5);
  }
};

export default Balance;
