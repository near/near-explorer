/// Copied from near-wallet project:
import BN from "bn.js";
import { FC, ReactNode } from "react";
import { utils } from "near-api-js";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

interface Props {
  amount: string | BN;
  label?: ReactNode;
  suffix?: ReactNode;
  className?: string;
  formulatedAmount?: string;
  fracDigits?: number;
}

const Balance: FC<Props> = ({
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
};

export const formatNEAR = (amount: string | BN, fracDigits = 5): string => {
  let ret = utils.format.formatNearAmount(amount.toString(), fracDigits);

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
