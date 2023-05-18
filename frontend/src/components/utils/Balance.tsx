import * as React from "react";

import JSBI from "jsbi";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

import * as BI from "@/frontend/libraries/bigint";

const ROUNDING_OFFSETS: JSBI[] = [];
for (
  let i = 0, offset = JSBI.BigInt(5);
  i < BI.nearNominationExponent;
  i += 1, offset = JSBI.multiply(offset, BI.ten)
) {
  ROUNDING_OFFSETS[i] = offset;
}

export const formatWithCommas = (value: string): string => {
  const pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(value)) {
    // eslint-disable-next-line no-param-reassign
    value = value.toString().replace(pattern, "$1,$2");
  }
  return value;
};

const formatNearAmount = (
  inputBalance: string | JSBI,
  fracDigits: number
): string => {
  let balanceBN = JSBI.BigInt(inputBalance);
  if (fracDigits !== BI.nearNominationExponent) {
    // Adjust balance for rounding at given number of digits
    const roundingExp = BI.nearNominationExponent - fracDigits - 1;
    if (roundingExp > 0) {
      balanceBN = JSBI.add(balanceBN, ROUNDING_OFFSETS[roundingExp]);
    }
  }
  const balance = balanceBN.toString();
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
  }
  if (ret === "0") {
    return `<${!fracDigits ? `0` : `0.${"0".repeat((fracDigits || 1) - 1)}1`}`;
  }
  return ret;
};

export const showInYocto = (amountStr: string) =>
  `${formatWithCommas(amountStr)} yoctoⓃ`;

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

    const amountShow = !formulatedAmount
      ? formatNEAR(amount, fracDigits)
      : formulatedAmount;
    const amountPrecise = showInYocto(amount.toString());
    return (
      <OverlayTrigger
        placement="bottom"
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

export default Balance;
