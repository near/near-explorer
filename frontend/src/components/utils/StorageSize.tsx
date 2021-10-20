import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Translate, TranslateFunction } from "react-localize-redux";
import { formatWithCommas } from "../utils/Balance";

interface Props {
  value: number;
}
const StorageSize = ({ value }: Props) => {
  const formatStoreSize = (
    value: number,
    translate: TranslateFunction
  ): string => {
    let showStorage = value.toString();
    const kilo = 10 ** 3;

    const units = [
      {
        value: kilo,
        symbol: translate("utils.StorageSize.kilo_bytes").toString(),
      },
      {
        value: kilo ** 2,
        symbol: translate("utils.StorageSize.mega_bytes").toString(),
      },
      {
        value: kilo ** 3,
        symbol: translate("utils.StorageSize.giga_bytes").toString(),
      },
    ];

    if (value >= kilo) {
      for (let i = 0; i < units.length; i++) {
        if (value >= units[i].value) {
          const roundValue = Math.round(value / units[i].value);
          showStorage = `${roundValue} ${units[i].symbol}`;
        }
      }
    } else {
      showStorage = `${value} ${translate("utils.StorageSize.bytes")}`;
    }

    return showStorage;
  };

  return (
    <Translate>
      {({ translate }) => (
        <OverlayTrigger
          placement={"bottom"}
          overlay={
            <Tooltip id={`storage_size_${value}`}>
              {`${formatWithCommas(value)} ${translate(
                "utils.StorageSize.bytes"
              )}`}
            </Tooltip>
          }
        >
          <span>{formatStoreSize(value, translate)}</span>
        </OverlayTrigger>
      )}
    </Translate>
  );
};

export default StorageSize;
