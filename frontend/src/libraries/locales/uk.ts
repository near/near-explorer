import dateFnsLocale from "date-fns/locale/uk";
import { getFormatterWithAccusativePlural } from "./forms";
import { DurationFormatter } from "./index";

const forms = {
  seconds: {
    one: "секунду",
    few: "секунди",
    many: "секунд",
  },
  minutes: {
    one: "хвилину",
    few: "хвилини",
    many: "хвилин",
  },
  hours: {
    one: "година",
    few: "години",
    many: "годин",
  },
  days: {
    one: "день",
    few: "дня",
    many: "днів",
  },
  weeks: {
    one: "тиждень",
    few: "тижня",
    many: "тижнів",
  },
  months: {
    one: "місяць",
    few: "місяця",
    many: "місяців",
  },
  years: {
    one: "рік",
    few: "року",
    many: "років",
  },
};

const durationFormatter: DurationFormatter = getFormatterWithAccusativePlural(
  forms,
  {
    justNow: () => "щойно",
    addTimeDirection: (input, isFuture) =>
      isFuture ? `через ${input}` : `${input} тому`,
  }
);

export const locale = {
  ...dateFnsLocale,
  durationFormatter,
};
