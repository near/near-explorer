import React from "react";
import { BetaOptions, BETA_COOKIE_NAME } from "../libraries/beta";
import { useCookie } from "./use-cookie";

export const useBetaOptions = () => {
  const [betaCookie, setBetaCookie] = useCookie<BetaOptions>(BETA_COOKIE_NAME);
  const setBetaOptions = React.useCallback<
    React.Dispatch<React.SetStateAction<BetaOptions>>
  >(
    (optionsOrUpdater) => {
      if (typeof optionsOrUpdater === "function") {
        setBetaCookie((prevCookie) => optionsOrUpdater(prevCookie));
      } else {
        setBetaCookie(optionsOrUpdater);
      }
    },
    [setBetaCookie]
  );
  return [betaCookie, setBetaOptions] as const;
};
