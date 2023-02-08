import React from "react";

import { SECOND } from "@explorer/frontend/libraries/time";

type UseEverySecondOptions = {
  runOnMount?: boolean;
};
export const useEverySecond = (
  callback: () => void,
  deps: React.DependencyList,
  options: UseEverySecondOptions = {}
) => {
  React.useEffect(() => {
    const now = new Date();
    const timeToSecond = SECOND - now.getMilliseconds();
    if (options.runOnMount) {
      callback();
    }
    let intervalId: NodeJS.Timer | undefined;
    const timeoutId = setTimeout(() => {
      callback();
      intervalId = setInterval(callback, SECOND);
    }, timeToSecond);
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
