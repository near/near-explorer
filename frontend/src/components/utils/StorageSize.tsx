import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { formatWithCommas } from "../utils/Balance";

interface Props {
  value: number;
}
const StorageSize = ({ value }: Props) => {
  let showStorage;
  const bite = "B";
  const kilo = 10 ** 3;

  const units = [
    { value: kilo, symbol: "kB" },
    { value: kilo ** 2, symbol: "MB" },
    { value: kilo ** 3, symbol: "GB" },
  ];

  if (value >= kilo) {
    for (let i = 0; i < units.length; i++) {
      if (value >= units[i].value) {
        const roundValue = Math.round(value / units[i].value);
        showStorage = `${roundValue} ${units[i].symbol}`;
      }
    }
  } else {
    showStorage = `${value} ${bite}`;
  }

  return (
    <OverlayTrigger
      placement={"bottom"}
      overlay={
        <Tooltip id={`storage_size_${value}`}>
          {`${formatWithCommas(value)} ${bite}`}
        </Tooltip>
      }
    >
      <span>{showStorage}</span>
    </OverlayTrigger>
  );
};

export default StorageSize;
