import * as Moment from "moment";

Moment.relativeTimeThreshold("ss", 1);

Moment.updateLocale("en", {
  relativeTime: {
    past: input => {
      return input === "just now" ? "1s ago" : input + " ago";
    },
    s: "just now",
    future: "in %s",
    ss: "%ds",
    m: "1m",
    mm: "%dm",
    h: "1hr",
    hh: "%dhr",
    d: "1d",
    dd: "%dd",
    M: "1 mth",
    MM: "%d mths",
    y: "1y",
    yy: "%dy"
  }
});

export default Moment;
