import JSBI from "jsbi";
import * as React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import * as BI from "../../libraries/bigint";

interface Props {
  amount: string | JSBI;
  label?: React.ReactNode;
  suffix?: React.ReactNode;
  className?: string;
  formulatedAmount?: string;
  fracDigits?: number;
}

const Balance: React.FC<Props> = React.memo(
  ({
    amount,
    label = null,
    suffix = undefined,
    className,
    formulatedAmount = undefined,
    fracDigits = 5,
  }) => {
    if (!amount) {
      throw new Error("amount property should not be null");
    }

    const defaultLabel = "Ⓝ";

    let amountShow = !formulatedAmount
      ? formatNEAR(amount, fracDigits)
      : formulatedAmount;
    let amountPrecise = showInYocto(amount.toString());
    return (
      <OverlayTrigger
        placement={"bottom"}
        overlay={<Tooltip id="balance">{amountPrecise}</Tooltip>}
      >
        <span className={className}>
          {amountShow}
          {suffix}
          &nbsp;
          {label ?? defaultLabel}
        </span>
      </OverlayTrigger>
    );
  }
);

const ROUNDING_OFFSETS: JSBI[] = [];
for (
  let i = 0, offset = JSBI.BigInt(5);
  i < BI.nearNominationExponent;
  i++, offset = JSBI.multiply(offset, BI.ten)
) {
  ROUNDING_OFFSETS[i] = offset;
}

const formatNearAmount = (
  balance: string | JSBI,
  fracDigits: number
): string => {
  let balanceBN = JSBI.BigInt(balance);
  if (fracDigits !== BI.nearNominationExponent) {
    // Adjust balance for rounding at given number of digits
    const roundingExp = BI.nearNominationExponent - fracDigits - 1;
    if (roundingExp > 0) {
      balanceBN = JSBI.add(balanceBN, ROUNDING_OFFSETS[roundingExp]);
    }
  }
  balance = balanceBN.toString();
  const wholeStr =
    balance.substring(0, balance.length - BI.nearNominationExponent) || "0";
  const fractionStr = balance
    .substring(balance.length - BI.nearNominationExponent)
    .padStart(BI.nearNominationExponent, "0")
    .substring(0, fracDigits);
  return `${formatWithCommas(wholeStr)}.${fractionStr}`.replace(/\.?0*$/, "");
};

export const formatNEAR = (amount: string | JSBI, fracDigits = 5): string => {
  const ret = formatNearAmount(amount.toString(), fracDigits);

  if (amount === "0") {
    return amount;
  } else if (ret === "0") {
    return `<${!fracDigits ? `0` : `0.${"0".repeat((fracDigits || 1) - 1)}1`}`;
  }
  return ret;
};

export const showInYocto = (amountStr: string) => {
  return formatWithCommas(amountStr) + " yoctoⓃ";
};

export const formatWithCommas = (value: string): string => {
  const pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(value)) {
    value = value.toString().replace(pattern, "$1,$2");
  }
  return value;
};

export default Balance;
