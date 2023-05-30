import * as React from "react";

import { track, AnalyticsEvent } from "@/frontend/hooks/analytics/analytics";

export const useAnalyticsTrack = () =>
  React.useCallback<(event: string, args?: AnalyticsEvent) => void>(
    (event, args) => track(event, args),
    []
  );
