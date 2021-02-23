import mixpanel from "mixpanel-browser";

const BROWSER_MIXPANEL_TOKEN = "7cc6cbaab18d00de1b06ca9b4e773ed7";

mixpanel.init(BROWSER_MIXPANEL_TOKEN);
mixpanel.register({ timestamp: new Date().toString() });

export const Mixpanel = {
  get_distinct_id: () => {
    return mixpanel.get_distinct_id();
  },
  identify: (id: string) => {
    mixpanel.identify(id);
  },
  track: (name: string, props: object) => {
    mixpanel.track(name, props);
  },
  people: {
    set_once: (props: object) => {
      mixpanel.people.set_once(props);
    },
  },
  withTracking: async (name: string, fn: Function) => {
    try {
      await fn();
      mixpanel.track(`${name} finish`);
    } catch (e) {
      mixpanel.track(`${name} fail`, { error: e.message });
    }
  },
};
