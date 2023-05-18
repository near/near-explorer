import React from "react";

import { useTranslation } from "next-i18next";

import CopyToClipboard from "@/frontend/components/utils/CopyToClipboard";
import { useDateFormat } from "@/frontend/hooks/use-date-format";

type Props = {
  timestamp: number;
};

const Timestamp: React.FC<Props> = ({ timestamp }) => {
  const { t } = useTranslation();
  const format = useDateFormat();
  return (
    <>
      <span>{format(timestamp, t(`pages.account.activity.dateFormat`))}</span>
      <CopyToClipboard
        css={{ marginHorizontal: ".3em", fontSize: "1.5em" }}
        text={timestamp.toString()}
      />
    </>
  );
};

export default Timestamp;
