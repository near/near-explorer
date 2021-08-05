/// Copied from near-wallet project:
import BN from "bn.js";
import { utils } from "near-api-js";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const FRAC_DIGITS = 5;

class Balance extends React.PureComponent {
  render() {
    const {
      amount,
      label = null,
      className = undefined,
      formulatedAmount = undefined,
    } = this.props;

    if (!amount) {
      throw new Error("amount property should not be null");
    }

    const defaultLabel = "Ⓝ";

    let amountShow = !formulatedAmount ? formatNEAR(amount) : formulatedAmount;
    let amountPrecise = showInYocto(amount);
    return (
      <OverlayTrigger
        placement={"bottom"}
        overlay={<Tooltip>{amountPrecise}</Tooltip>}
      >
        <span className={className}>
          {amountShow} {label ?? defaultLabel}
        </span>
      </OverlayTrigger>
    );
  }
}

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

export const formatWithCommas = (value) => {
  const pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(value)) {
    value = value.toString().replace(pattern, "$1,$2");
  }
  return value;
};

export default Balance;
