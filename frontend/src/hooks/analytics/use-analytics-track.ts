import * as React from "react";
import mixpanel, { Dict } from "mixpanel-browser";

export const useAnalyticsTrack = () => {
  return React.useCallback<(event: string, args?: Dict) => void>(
    (event, args) => mixpanel.track(event, args),
    []
  );
};
