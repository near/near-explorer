import * as React from "react";

import analytics, {
  AnalyticsEvent,
} from "@explorer/frontend/hooks/analytics/analytics";

export const useAnalyticsTrack = () =>
  React.useCallback<(event: string, args?: AnalyticsEvent) => void>(
    (event, args) => analytics.track(event, args),
    []
  );
