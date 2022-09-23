import * as React from "react";
import analytics, { Dict } from "./analytics";

export const useAnalyticsTrack = () => {
  return React.useCallback<(event: string, args?: Dict) => void>(
    (event, args) => analytics.track(event, args),
    []
  );
};
