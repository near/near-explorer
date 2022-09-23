import Analytics from "analytics-node";
import { uniqueId } from "lodash";
import { getConfig } from "../../libraries/config";

export interface Dict {
  [key: string]: any;
}

let segment: Analytics;
let anonymousId: string;

function init() {
  if (segment)
    return console.log("Segment Analytics has already been initialized");
  anonymousId = uniqueId(Date.now() + "_");
  //flushAt=1 is useful for testing new events
  const {
    publicRuntimeConfig: { segmentWriteKey },
  } = getConfig();
  const options = process.env.NODE_ENV === "development" ? { flushAt: 1 } : {};
  segment = new Analytics(segmentWriteKey, options);
}

function track(eventLabel: string, properties?: Dict) {
  segment.track({
    anonymousId,
    event: eventLabel,
    properties,
  });
}

function identify() {
  segment.identify({
    userId: anonymousId,
  });
}

const fns = {
  identify,
  init,
  track,
};

export default fns;
