import * as React from "react";
import mixpanel from "mixpanel-browser";

const BROWSER_MIXPANEL_TOKEN = "df164f13212cbb0dfdae991da60e87f2";

if (typeof window !== "undefined") {
  mixpanel.init(BROWSER_MIXPANEL_TOKEN);
  mixpanel.register({ timestamp: new Date().toString() });
}

export const useAnalyticsInit = () => {
  return React.useEffect(() => {
    // Set unique id for session
    mixpanel.identify(mixpanel.get_distinct_id());
    mixpanel.people.set_once({ first_touch_date: new Date().toString() });
  }, []);
};
