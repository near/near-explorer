import * as React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { formatWithCommas } from "../utils/Balance";

interface Props {
  value: number;
}
const StorageSize: React.FC<Props> = React.memo(({ value }) => {
  const { t } = useTranslation();
  const formatStoreSize = (value: number): string => {
    let showStorage = value.toString();
    const kilo = 10 ** 3;

    const units = [
      {
        value: kilo,
        symbol: t("utils.StorageSize.kilo_bytes"),
      },
      {
        value: kilo ** 2,
        symbol: t("utils.StorageSize.mega_bytes"),
      },
      {
        value: kilo ** 3,
        symbol: t("utils.StorageSize.giga_bytes"),
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
      showStorage = `${value} ${t("utils.StorageSize.bytes")}`;
    }

    return showStorage;
  };

  return (
    <OverlayTrigger
      placement={"bottom"}
      overlay={
        <Tooltip id={`storage_size_${value}`}>
          {`${formatWithCommas(value.toString())} ${t(
            "utils.StorageSize.bytes"
          )}`}
        </Tooltip>
      }
    >
      <span>{formatStoreSize(value)}</span>
    </OverlayTrigger>
  );
});

export default StorageSize;
