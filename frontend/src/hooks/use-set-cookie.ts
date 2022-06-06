import * as React from "react";
import Cookies from "universal-cookie";
import { YEAR } from "../libraries/time";

export const useSetCookie = <T extends string>(
  key: string
): React.Dispatch<T> => {
  const cookiesRef = React.useRef(new Cookies());
  const setCookieValue = React.useCallback<React.Dispatch<T>>(
    (nextValue) => {
      cookiesRef.current.set(key, nextValue, {
        maxAge: YEAR / 1000,
        path: "/",
      });
    },
    [key, cookiesRef]
  );
  return setCookieValue;
};
