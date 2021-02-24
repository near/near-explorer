import mixpanel from "mixpanel-browser";

const BROWSER_MIXPANEL_TOKEN = "7cc6cbaab18d00de1b06ca9b4e773ed7";

if (process.env.NEAR_EXPLORER_DATA_SOURCE) {
  mixpanel.init(BROWSER_MIXPANEL_TOKEN);
  mixpanel.register({ timestamp: new Date().toString() });
}

const MixpanelReal = {
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
};

const MixpanelMock = {
  get_distinct_id: () => {
    return "distinct_id";
  },
  identify: (id: string) => {
    console.log(id);
  },
  track: (name: string, props: object) => {
    console.log(name, props);
  },
  people: {
    set_once: (props: object) => {
      console.log(props);
    },
  },
};

const Mixpanel = process.env.NEAR_EXPLORER_DATA_SOURCE
  ? MixpanelReal
  : MixpanelMock;

export default Mixpanel;
