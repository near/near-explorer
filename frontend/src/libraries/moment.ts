import moment from "moment";

import "moment/locale/ru";
import "moment/locale/zh-cn";
import "moment/locale/vi";
import "moment/locale/uk";

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

moment.updateLocale("vi", {
  relativeTime: {
    past: (input) => {
      return input === "vừa xong" ? "1 giây trước" : input + " trước";
    },
    s: "vừa xong",
    future: "trong %s",
    ss: "%d giây",
    m: "1 phút",
    mm: "%d phút",
    h: "1 giờ",
    hh: "%d giờ",
    d: "1 ngày",
    dd: "%d ngày",
    M: "1 tháng",
    MM: "%d tháng",
    y: "1 năm",
    yy: "%d năm",
  },
});

moment.updateLocale("ru", {
  relativeTime: {
    future: "через %s",
    past: "%s назад",
    s: "секунд",
    ss: relativeTimeWithPlural,
    m: relativeTimeWithPlural,
    mm: relativeTimeWithPlural,
    h: "час",
    hh: relativeTimeWithPlural,
    d: "день",
    dd: relativeTimeWithPlural,
    w: "неделя",
    ww: relativeTimeWithPlural,
    M: "месяц",
    MM: relativeTimeWithPlural,
    y: "год",
    yy: relativeTimeWithPlural,
  },
});

moment.updateLocale("uk", {
  relativeTime: {
    future: "через %s",
    past: "%s тому",
    s: "секунд",
    ss: relativeTimeWithPluralUa,
    m: relativeTimeWithPluralUa,
    mm: relativeTimeWithPluralUa,
    h: "година",
    hh: relativeTimeWithPluralUa,
    d: "день",
    dd: relativeTimeWithPluralUa,
    w: "тиждень",
    ww: relativeTimeWithPluralUa,
    M: "місяць",
    MM: relativeTimeWithPluralUa,
    y: "рік",
    yy: relativeTimeWithPluralUa,
  },
});

function plural(word: string, num: number): string {
  var forms = word.split("_");
  return num % 10 === 1 && num % 100 !== 11
    ? forms[0]
    : num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20)
    ? forms[1]
    : forms[2];
}
function relativeTimeWithPlural(
  number: number,
  withoutSuffix: boolean,
  key: string
) {
  const format: Record<string, string> = {
    ss: withoutSuffix ? "секунда_секунды_секунд" : "секунду_секунды_секунд",
    mm: withoutSuffix ? "минута_минуты_минут" : "минуту_минуты_минут",
    hh: "час_часа_часов",
    dd: "день_дня_дней",
    ww: "неделя_недели_недель",
    MM: "месяц_месяца_месяцев",
    yy: "год_года_лет",
  };
  if (key === "m") {
    return withoutSuffix ? "минута" : "минуту";
  } else {
    return number + " " + plural(format[key], +number);
  }
}

function relativeTimeWithPluralUa(
  number: number,
  withoutSuffix: boolean,
  key: string
) {
  const format: Record<string, string> = {
    ss: withoutSuffix ? "секунда_секунди_секунд" : "секунду_секунди_секунд",
    mm: withoutSuffix ? "хвилина_хвилини_хвилин" : "хвилину_хвилини_хвилин",
    hh: "гадина_години_годин",
    dd: "день_дня_днів",
    ww: "тиждень_тижня_тижнів",
    MM: "місяць_місяця_місяців",
    yy: "рік_року_років",
  };
  if (key === "m") {
    return withoutSuffix ? "хвилина" : "хвилину";
  } else {
    return number + " " + plural(format[key], +number);
  }
}

export default moment;
