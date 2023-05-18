import React from "react";

import { CookieChangeListener, CookieSetOptions } from "universal-cookie";

import { CookieContext } from "@/frontend/libraries/cookie";
import { YEAR } from "@/frontend/libraries/time";

export const useCookie = <T extends NonNullable<any>>(
  cookieName: string,
  { defaultValue, ...options }: CookieSetOptions & { defaultValue?: T } = {}
) => {
  const cookiesContext = React.useContext(CookieContext);
  const [value, setValue] = React.useState<
    typeof options extends { defaultValue: undefined } ? T | undefined : T
  >(() => cookiesContext.get(cookieName) || defaultValue);
  const changeListener = React.useCallback<CookieChangeListener>(
    (event) => {
      if (event.name !== cookieName) {
        return;
      }
      try {
        const parsedValue = JSON.parse(event.value);
        setValue(parsedValue);
      } catch (e) {
        setValue(event.value);
      }
    },
    [cookieName, setValue]
  );
  React.useEffect(() => {
    if (typeof value !== "undefined" || typeof defaultValue === "undefined") {
      return;
    }
    setValue(defaultValue);
  }, [value, defaultValue, setValue]);
  React.useEffect(() => {
    cookiesContext.addChangeListener(changeListener);
    return () => cookiesContext.removeChangeListener(changeListener);
  }, [cookiesContext, changeListener]);
  const setCookieValue = React.useCallback<
    React.Dispatch<
      React.SetStateAction<
        typeof options extends { defaultValue: undefined } ? T | undefined : T
      >
    >
  >(
    (nextValueOrFn) => {
      let nextValue = nextValueOrFn;
      if (typeof nextValueOrFn === "function") {
        nextValue = (nextValueOrFn as (prevState: T) => T)(
          cookiesContext.get(cookieName)
        );
      }
      cookiesContext.set(cookieName, nextValue, {
        maxAge: YEAR / 1000,
        path: "/",
        ...options,
      });
    },
    [cookieName, cookiesContext, options]
  );
  return [value, setCookieValue] as const;
};
