import * as React from "react";
import { AnalyticsEvent } from "./analytics";
import { useAnalyticsTrack } from "./use-analytics-track";

export const useAnalyticsTrackOnMount = (
  event: string,
  args?: AnalyticsEvent
) => {
  const track = useAnalyticsTrack();
  return React.useEffect(() => track(event, args), [track, event, args]);
};
