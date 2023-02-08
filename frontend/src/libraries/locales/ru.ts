import dateFnsLocale from "date-fns/locale/ru";
import { getFormatterWithAccusativePlural } from "@explorer/frontend/libraries/locales/forms";
import {
  AccusativeForms,
  DurationFormatter,
} from "@explorer/frontend/libraries/locales/index";

const forms: AccusativeForms = {
  seconds: {
    one: "секунду",
    few: "секунды",
    many: "секунд",
  },
  minutes: {
    one: "минуту",
    few: "минуты",
    many: "минут",
  },
  hours: {
    one: "час",
    few: "часа",
    many: "часов",
  },
  days: {
    one: "день",
    few: "дня",
    many: "дней",
  },
  weeks: {
    one: "неделя",
    few: "недели",
    many: "недель",
  },
  months: {
    one: "месяц",
    few: "месяца",
    many: "месяцев",
  },
  years: {
    one: "год",
    few: "года",
    many: "лет",
  },
};

const durationFormatter: DurationFormatter = getFormatterWithAccusativePlural(
  forms,
  {
    justNow: () => "только что",
    addTimeDirection: (input, isFuture) =>
      isFuture ? `через ${input}` : `${input} назад`,
  }
);

export const locale = {
  ...dateFnsLocale,
  durationFormatter,
};
