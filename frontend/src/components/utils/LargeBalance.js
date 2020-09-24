/// Copied from near-wallet project:
import { utils } from "near-api-js";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default ({ amount }) => {
  console.log(amount);
  if (!amount) {
    throw new Error("amount property should not be null");
  }

  let amountShow = formatNEAR(amount);
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

export const formatNEAR = (amount) => {
  let ret = utils.format.formatNearAmount(amount.toString(), 0);
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
