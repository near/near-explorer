import moment from "moment";

moment.relativeTimeThreshold("ss", 1);

moment.updateLocale("en", {
  relativeTime: {
    past: (input) => {
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
    yy: "%dy",
  },
});

moment.updateLocale("zh", {
  relativeTime: {
    past: (input) => {
      return input === "刚才" ? "1秒前" : input + "前";
    },
    s: "刚才",
    future: "在%s",
    ss: "%d秒",
    m: "1分钟",
    mm: "%d分钟",
    h: "1小时",
    hh: "%d小时",
    d: "1天",
    dd: "%d天",
    M: "1月",
    MM: "%d月",
    y: "1年",
    yy: "%d年",
  },
});

export default moment;
