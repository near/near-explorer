import dateFnsLocale from "date-fns/locale/zh-CN";
import { DurationFormatter } from "./index";

const durationFormatter: DurationFormatter = {
  years: (input) => `${input}年`,
  months: (input) => `${input}月`,
  weeks: (input) => `${input}周`,
  days: (input) => `${input}天`,
  hours: (input) => `${input}小时`,
  minutes: (input) => `${input}分钟`,
  seconds: (input) => (input > 1 ? `${input}秒` : "1秒前"),
  justNow: () => "刚才",
  addTimeDirection: (input, isFuture) =>
    isFuture ? `在${input}` : `${input}前`,
};

export const locale = {
  ...dateFnsLocale,
  durationFormatter,
};
