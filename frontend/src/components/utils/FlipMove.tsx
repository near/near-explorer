import * as React from "react";

import FlipMoveRaw from "react-flip-move";

export interface Props {
  duration?: number;
  staggerDurationBy?: number;
  children?: React.ReactNode;
}

const FixedFlipMove =
  FlipMoveRaw as unknown as React.FC<FlipMoveRaw.FlipMoveProps>;

export const FlipMove: React.FC<Props> = React.memo(
  ({ children, ...props }) => {
    if (typeof document === "undefined" || document.hidden) {
      return <div>{children}</div>;
    }
    return <FixedFlipMove {...props}>{children}</FixedFlipMove>;
  }
);
