import React from "react";

export const usePrevious = <T>(value: T): T | undefined => {
  const ref = React.useRef<T | undefined>();
  React.useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};
