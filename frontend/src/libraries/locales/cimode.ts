import dateFnsLocale from "date-fns/locale/en-US";
import { DurationFormatter } from ".";

const durationFormatter: DurationFormatter = {
  years: (input) => `${input}y`,
  months: (input) => `${input}M`,
  weeks: (input) => `${input}w`,
  days: (input) => `${input}d`,
  hours: (input) => `${input}h`,
  minutes: (input) => `${input}m`,
  seconds: (input) => `${input}s`,
  justNow: () => "0s",
  addTimeDirection: (input, isFuture) =>
    isFuture ? `${input} future` : `${input} past`,
};

export const locale = {
  ...dateFnsLocale,
  durationFormatter,
};
