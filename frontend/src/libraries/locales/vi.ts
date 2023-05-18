import dateFnsLocale from "date-fns/locale/vi";

import { DurationFormatter } from "@/frontend/libraries/locales/index";

const durationFormatter: DurationFormatter = {
  years: (input) => `${input} năm`,
  months: (input) => `${input} tháng`,
  weeks: (input) => `${input} tuần`,
  days: (input) => `${input} ngày`,
  hours: (input) => `${input} giờ`,
  minutes: (input) => `${input} phút`,
  seconds: (input) => (input > 1 ? `${input} giây` : "1 giây trước"),
  justNow: () => "vừa xong",
  addTimeDirection: (input, isFuture) =>
    isFuture ? `trong ${input}` : `${input} trước`,
};

export const locale = {
  ...dateFnsLocale,
  durationFormatter,
};
