import { Dict } from "mixpanel-browser";
import { useEffect } from "react";
import { useAnalyticsTrack } from "./use-analytics-track";

export const useAnalyticsTrackOnMount = (event: string, args?: Dict) => {
  const track = useAnalyticsTrack();
  return useEffect(() => track(event, args), [track, event, args]);
};
