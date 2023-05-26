import Analytics from "analytics-node";
import { uniqueId } from "lodash";

import { getConfig } from "@/frontend/libraries/config";

export type AnalyticsEvent = {
  [key: string]: any;
};

let segment: Analytics;
let anonymousId: string;

export const init = () => {
  if (segment) {
    return;
  }
  anonymousId = uniqueId(`${Date.now()}_`);
  const {
    publicRuntimeConfig: { segmentWriteKey },
  } = getConfig();
  // flushAt=1 is useful for testing new events
  const options = process.env.NODE_ENV === "development" ? { flushAt: 1 } : {};
  segment = new Analytics(segmentWriteKey, options);
};

export const track = (eventLabel: string, properties?: AnalyticsEvent) => {
  segment.track({
    anonymousId,
    event: eventLabel,
    properties,
  });
};

export const identify = () => {
  segment.identify({
    userId: anonymousId,
  });
};
