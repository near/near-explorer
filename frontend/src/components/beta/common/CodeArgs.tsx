import * as React from "react";
import { hexy } from "hexy";

import { styled } from "../../../libraries/styles";

import CodePreview from "../../utils/CodePreview";
import JsonView from "./JsonView";

const HexArgs = styled("div", {
  "& > div": {
    background: "#f8f8f8",
    borderRadius: 4,
    color: "#3f4246",
    padding: 20,
    fontSize: "$font-m",
    fontWeight: 500,
    fontFamily: "SF Mono",

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
    prettyArgs = JSON.parse(decodedArgs.toString());
  } catch {
    console.log(
      "catch hexy: ",
      JSON.stringify(hexy(decodedArgs, { format: "twos" }))
    );

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
