/// Copied from near-wallet project:
import BN from "bn.js";
import { utils } from "near-api-js";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const FRAC_DIGITS = 5;

// roundSuffix = "K" | "M" | "B"
const Balance = ({ amount, round = false, roundSuffix = null }) => {
  if (!amount) {
    throw new Error("amount property should not be null");
  }

  let amountShow =
    round || roundSuffix ? roundTo(amount, roundSuffix) : formatNEAR(amount);
  let amountPrecise = showInYocto(amount);
  return (
    <OverlayTrigger
      placement={"bottom"}
      overlay={<Tooltip>{amountPrecise}</Tooltip>}
    >
      <span>{amountShow} Ⓝ</span>
    </OverlayTrigger>
  );
};

export const roundTo = (amount, roundSuffix) => {
  // const thousand = new BN(10 ** 3);
  const million = new BN(10 ** 6);
  const billion = new BN(10 ** 9);

  let BNAmount = new BN(amount);
  let formattedAmount;

  if ((BNAmount.gte(million) && BNAmount.lte(billion)) || roundSuffix === "M") {
    formattedAmount = `${formatNEAR(BNAmount.div(million))}M`;
  } else if (BNAmount.gte(billion) || roundSuffix === "B") {
    formattedAmount = `${formatNEAR(BNAmount.div(billion))}B`;
  } else {
    formattedAmount = formatNEAR(BNAmount);
  }
  return formattedAmount;
};

export const formatNEAR = (amount) => {
  let ret = utils.format.formatNearAmount(amount.toString(), FRAC_DIGITS);

  if (amount === "0") {
    return amount;
  } else if (ret === "0") {
    return `<${
      !FRAC_DIGITS ? `0` : `0.${"0".repeat((FRAC_DIGITS || 1) - 1)}1`
    }`;
  }
  return ret;
};

export const showInYocto = (amountStr) => {
  return formatWithCommas(amountStr) + " yoctoⓃ";
};

const formatWithCommas = (value) => {
  const pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(value)) {
    value = value.toString().replace(pattern, "$1,$2");
  }
  return value;
};

export default Balance;
