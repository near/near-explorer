import * as React from "react";

import { JsonViewer } from "@textea/json-viewer";

type Props = {
  args: object;
};

const css: React.CSSProperties = {
  fontSize: "14px",
  padding: "10px 0",
};

export const JsonView: React.FC<Props> = React.memo(({ args }) => (
  <JsonViewer
    value={args}
    style={css}
    displayObjectSize={false}
    displayDataTypes={false}
  />
));
