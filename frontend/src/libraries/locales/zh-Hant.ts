import dateFnsLocale from "date-fns/locale/zh-TW";
import { DurationFormatter } from "@explorer/frontend/libraries/locales/index";

const durationFormatter: DurationFormatter = {
  years: (input) => `${input}年`,
  months: (input) => `${input}月`,
  weeks: (input) => `${input}周`,
  days: (input) => `${input}天`,
  hours: (input) => `${input}小時`,
  minutes: (input) => `${input}分鍾`,
  seconds: (input) => (input > 1 ? `${input}秒` : "1秒前"),
  justNow: () => "剛才",
  addTimeDirection: (input, isFuture) =>
    isFuture ? `在${input}` : `${input}前`,
};

export const locale = {
  ...dateFnsLocale,
  durationFormatter,
};
