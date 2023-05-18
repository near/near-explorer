import * as React from "react";

import { AnalyticsEvent } from "@/frontend/hooks/analytics/analytics";
import { useAnalyticsTrack } from "@/frontend/hooks/analytics/use-analytics-track";

export const useAnalyticsTrackOnMount = (
  event: string,
  args?: AnalyticsEvent
) => {
  const track = useAnalyticsTrack();
  return React.useEffect(() => track(event, args), [track, event, args]);
};
