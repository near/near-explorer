import * as React from "react";
import { hexy } from "hexy";

import { styled } from "@explorer/frontend/libraries/styles";

import CodePreview from "@explorer/frontend/components/utils/CodePreview";
import JsonView from "@explorer/frontend/components/beta/common/JsonView";

const HexArgs = styled("div", {
  padding: "10px 0",

  "& > div": {
    background: "#f8f8f8",
    borderRadius: 4,
    color: "#3f4246",
    padding: 20,
    fontSize: 14,
    fontWeight: 500,

    "& textarea, pre": {
      background: "inherit",
      color: "inherit",
      fontFamily: "inherit",
      fontSize: "inherit",
      border: "none",
      padding: 0,
    },
  },
});

const CodeArgs: React.FC<{ args: string }> = React.memo(({ args }) => {
  const decodedArgs = Buffer.from(args, "base64");

  let prettyArgs: object | string;
  try {
    const parsedJSONArgs = JSON.parse(decodedArgs.toString());
    prettyArgs =
      typeof parsedJSONArgs === "boolean"
        ? JSON.stringify(parsedJSONArgs)
        : parsedJSONArgs;
  } catch {
    prettyArgs = hexy(decodedArgs, { format: "twos" });
  }
  return typeof prettyArgs === "object" ? (
    <JsonView args={prettyArgs} />
  ) : (
    <HexArgs>
      <CodePreview collapseHeight={200} maxHeight={600} value={prettyArgs} />
    </HexArgs>
  );
});

export default CodeArgs;
