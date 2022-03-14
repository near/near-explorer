import { Dict } from "mixpanel-browser";
import * as React from "react";
import { useAnalyticsTrack } from "./use-analytics-track";

export const useAnalyticsTrackOnMount = (event: string, args?: Dict) => {
  const track = useAnalyticsTrack();
  return React.useEffect(() => track(event, args), [track, event, args]);
};
