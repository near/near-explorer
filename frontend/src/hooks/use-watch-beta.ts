import React from "react";

import { useBetaOptions } from "@explorer/frontend/hooks/use-beta-options";
import { useQueryParam } from "@explorer/frontend/hooks/use-query-param";

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
