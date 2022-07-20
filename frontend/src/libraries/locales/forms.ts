import { AccusativeForms, DurationFormatter, PluralForms } from "./index";

const getPluralForm = (input: number, forms: PluralForms): string => {
  return input % 10 === 1 && input % 100 !== 11
    ? forms.one
    : input % 10 >= 2 &&
      input % 10 <= 4 &&
      (input % 100 < 10 || input % 100 >= 20)
    ? forms.few
    : forms.many;
};

export const getFormatterWithAccusativePlural = (
  forms: AccusativeForms,
  rest: Pick<DurationFormatter, "justNow" | "addTimeDirection">
): DurationFormatter => {
  return {
    ...rest,
    years: (input) => `${input} ${getPluralForm(input, forms.years)}`,
    months: (input) => `${input} ${getPluralForm(input, forms.months)}`,
    weeks: (input) => `${input} ${getPluralForm(input, forms.weeks)}`,
    days: (input) => `${input} ${getPluralForm(input, forms.days)}`,
    hours: (input) => `${input} ${getPluralForm(input, forms.hours)}`,
    minutes: (input) => `${input} ${getPluralForm(input, forms.minutes)}`,
    seconds: (input) => `${input} ${getPluralForm(input, forms.seconds)}`,
  };
};
