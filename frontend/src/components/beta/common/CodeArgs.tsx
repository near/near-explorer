import * as React from "react";
import loadable from "@loadable/component";
// https://github.com/mac-s-g/react-json-view/issues/296#issuecomment-997176256
const ReactJson = loadable(() => import("react-json-view"));

type Props = {
  args: object;
};

const CodeArgs: React.FC<Props> = React.memo(({ args }) => (
  <ReactJson
    src={args}
    name={null}
    iconStyle="triangle"
    displayObjectSize={false}
    displayDataTypes={false}
    style={{
      fontSize: "14px",
      padding: "10px",
      margin: "10px 0",
      fontFamily: "SF Mono",
    }}
  />
));

export default CodeArgs;
