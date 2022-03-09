import * as React from "react";
import Cookies from "universal-cookie";
import { YEAR } from "../libraries/time";

export const useCookie = <T extends string>(
  key: string,
  defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const cookiesRef = React.useRef(new Cookies());
  const getCookie = React.useCallback(
    () => cookiesRef.current.get<T | undefined>(key) || defaultValue,
    [key, defaultValue]
  );
  const [value, setValue] = React.useState<T>(getCookie);
  React.useEffect(() => setValue(getCookie), [key]);
  const setCookieValue = React.useCallback<
    React.Dispatch<React.SetStateAction<T>>
  >(
    (setStateAction) => {
      setValue((prevValue) => {
        const nextValue =
          typeof setStateAction === "function"
            ? setStateAction(prevValue)
            : setStateAction;
        cookiesRef.current.set(key, nextValue, {
          maxAge: YEAR / 1000,
        });
        return nextValue;
      });
    },
    [setValue, key, cookiesRef]
  );
  return [value, setCookieValue];
};
