import React from "react";

import { useCookie } from "@/frontend/hooks/use-cookie";
import { BetaOptions, BETA_COOKIE_NAME } from "@/frontend/libraries/beta";

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
