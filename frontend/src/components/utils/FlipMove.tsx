import * as React from "react";

import FlipMove from "react-flip-move";

export interface Props {
  duration?: number;
  staggerDurationBy?: number;
  children?: React.ReactNode;
}

const FixedFlipMove = FlipMove as unknown as React.FC<FlipMove.FlipMoveProps>;

const FlipMoveEx: React.FC<Props> = React.memo(({ children, ...props }) => {
  if (typeof document === "undefined" || document.hidden) {
    return <div>{children}</div>;
  }
  return <FixedFlipMove {...props}>{children}</FixedFlipMove>;
});

export default FlipMoveEx;
