import {
  useRef,
  useState,
  useEffect,
  SetStateAction,
  Dispatch,
  useCallback,
} from "react";
import Cookies from "universal-cookie";
import { YEAR } from "../libraries/time";

export const useCookie = <T extends string>(
  key: string,
  defaultValue: T
): [T, Dispatch<SetStateAction<T>>] => {
  const cookiesRef = useRef(new Cookies());
  const getCookie = useCallback(
    () => cookiesRef.current.get<T | undefined>(key) || defaultValue,
    [key, defaultValue]
  );
  const [value, setValue] = useState<T>(getCookie);
  useEffect(() => setValue(getCookie), [key]);
  const setCookieValue = useCallback<Dispatch<SetStateAction<T>>>(
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
