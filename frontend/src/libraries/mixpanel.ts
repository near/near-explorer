import mixpanel from "mixpanel-browser";

const BROWSER_MIXPANEL_TOKEN = "df164f13212cbb0dfdae991da60e87f2";

if (typeof window !== "undefined") {
  mixpanel.init(BROWSER_MIXPANEL_TOKEN);
  mixpanel.register({ timestamp: new Date().toString() });
}

export default mixpanel;
