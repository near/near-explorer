import Analytics from "analytics-node";
import { uniqueId } from "lodash";
import { getConfig } from "@explorer/frontend/libraries/config";

export type AnalyticsEvent = {
  [key: string]: any;
};

let segment: Analytics;
let anonymousId: string;

const init = () => {
  if (segment) {
    return console.log("Segment Analytics has already been initialized");
  }
  anonymousId = uniqueId(Date.now() + "_");
  const {
    publicRuntimeConfig: { segmentWriteKey },
  } = getConfig();
  //flushAt=1 is useful for testing new events
  const options = process.env.NODE_ENV === "development" ? { flushAt: 1 } : {};
  segment = new Analytics(segmentWriteKey, options);
};

const track = (eventLabel: string, properties?: AnalyticsEvent) => {
  segment.track({
    anonymousId,
    event: eventLabel,
    properties,
  });
};

const identify = () => {
  segment.identify({
    userId: anonymousId,
  });
};

export default {
  identify,
  init,
  track,
};
