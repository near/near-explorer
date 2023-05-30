import * as React from "react";

import { init, identify } from "@/frontend/hooks/analytics/analytics";

if (typeof window !== "undefined") {
  init();
}

export const useAnalyticsInit = () =>
  React.useEffect(() => {
    // Set unique id for session
    identify();
  }, []);
