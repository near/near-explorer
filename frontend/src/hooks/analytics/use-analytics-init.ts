import * as React from "react";

import analytics from "@/frontend/hooks/analytics/analytics";

if (typeof window !== "undefined") {
  analytics.init();
}

export const useAnalyticsInit = () =>
  React.useEffect(() => {
    // Set unique id for session
    analytics.identify();
  }, []);
