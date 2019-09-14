/// Copied from near-wallet project:
/// https://github.com/nearprotocol/near-wallet/blob/cd32c6ef99dcbcd9e4ab96bef0e65ea25a8bb4a3/src/components/common/Balance.js

// denomination of one near in minimal non divisible units (attoNears)
// NEAR_NOMINATION is 10 ** 18 one unit
export const NOMINATION = 18;
const REG = /(?=(\B)(\d{3})+$)/g;

export default ({ amount, milli }) => {
  if (!amount) {
    throw new Error("amount property should not be null");
  }
  if (!milli) {
    throw new Error("token image should not be null");
  }
  let amountShow =
    amount.length <= NOMINATION - 3
      ? convertToShowMilli(amount, milli)
      : convertToShow(amount);
  return <div>{amountShow}</div>;
};

const convertToShowMilli = (amount, milli) => {
  let style = {
    width: "1em",
    height: "1em",
    marginLeft: "3px",
    verticalAlign: "middle"
  };
  let zerosSmall = "0".repeat(NOMINATION - 3);
  return (
    <div>
      {"0." + (zerosSmall.substring(amount.length) + amount).slice(0, 5)}
      <img style={style} src={milli} alt="" />
    </div>
  );
};

const convertToShow = amount => {
  return <div>{formatNEAR(amount)} Ⓝ</div>;
};

export const formatNEAR = amount => {
  if (amount.length <= NOMINATION) {
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
