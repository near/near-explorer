import * as React from "react";

import dynamic from "next/dynamic";
// https://github.com/mac-s-g/react-json-view/issues/296#issuecomment-803497117
const DynamicReactJson = dynamic(import("react-json-view"), { ssr: false });

type Props = {
  args: object;
};

const JsonView: React.FC<Props> = React.memo(({ args }) => (
  <DynamicReactJson
    src={args}
    name={null}
    iconStyle="triangle"
    displayObjectSize={false}
    displayDataTypes={false}
    style={{
      fontSize: "14px",
      padding: "10px 0",
    }}
  />
));

export default JsonView;
