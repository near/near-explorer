import React from "react";

import CopyToClipboard from "@/frontend/components/utils/CopyToClipboard";
import { shortenString } from "@/frontend/libraries/formatting";

type Props = {
  children?: string;
};

const ShortenValue: React.FC<Props> = ({ children = "unknown" }) => {
  // ShortenValue is used in i18next-react which may pass the data as an array of strings with 1 element
  const stringifiedChildren = String(children);
  return (
    <span>
      {shortenString(stringifiedChildren)}
      <CopyToClipboard
        css={{ marginHorizontal: ".3em" }}
        text={stringifiedChildren}
      />
    </span>
  );
};

export default ShortenValue;
