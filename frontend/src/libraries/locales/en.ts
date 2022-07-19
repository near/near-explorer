import dateFnsLocale from "date-fns/locale/en-US";
import { DurationFormatter } from ".";

const durationFormatter: DurationFormatter = {
  years: (input) => `${input} year${input > 1 ? "s" : ""}`,
  months: (input) => `${input} month${input > 1 ? "s" : ""}`,
  weeks: (input) => `${input} week${input > 1 ? "s" : ""}`,
  days: (input) => `${input} day${input > 1 ? "s" : ""}`,
  hours: (input) => `${input} hour${input > 1 ? "s" : ""}`,
  minutes: (input) => `${input} minute${input > 1 ? "s" : ""}`,
  seconds: (input) => `${input} second${input > 1 ? "s" : ""}`,
  justNow: () => "just now",
  addTimeDirection: (input, isFuture) =>
    isFuture ? `in ${input}` : `${input} ago`,
};

export const locale = {
  ...dateFnsLocale,
  durationFormatter,
};
