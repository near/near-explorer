import React from "react";

export const typedMemo: <
  T extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>
>(
  c: T,
  areEqual?: (
    prev: React.ComponentProps<T>,
    next: React.ComponentProps<T>
  ) => boolean
) => T = React.memo;
