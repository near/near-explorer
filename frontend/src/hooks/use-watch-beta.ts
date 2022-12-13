import React from "react";
import { useBetaOptions } from "./use-beta-options";
import { useQueryParam } from "./use-query-param";

export const useWatchBeta = () => {
  const [enabledBeta, setEnableBeta] = useQueryParam("beta");
  const [, setBetaOptions] = useBetaOptions();
  React.useEffect(() => {
    if (!enabledBeta) {
      return;
    }
    setBetaOptions({ enabled: true });
    setEnableBeta(undefined);
  }, [enabledBeta, setBetaOptions, setEnableBeta]);
};
