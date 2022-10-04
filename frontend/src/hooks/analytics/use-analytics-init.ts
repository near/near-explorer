import * as React from "react";
import analytics from "./analytics";

if (typeof window !== "undefined") {
  analytics.init();
}

export const useAnalyticsInit = () => {
  return React.useEffect(() => {
    // Set unique id for session
    analytics.identify();
  }, []);
};
