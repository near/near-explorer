import React from "react";
import { SECOND } from "../libraries/time";

type UseEverySecondOptions = {
  runOnMount?: boolean;
};
export const useEverySecond = (
  callback: () => void,
  deps: unknown[],
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
  }, deps);
};
