export type DurationFormatter = {
  years: (input: number) => string;
  months: (input: number) => string;
  weeks: (input: number) => string;
  days: (input: number) => string;
  hours: (input: number) => string;
  minutes: (input: number) => string;
  seconds: (input: number) => string;
  justNow: () => string;
  addTimeDirection: (input: string, isFuture: boolean) => string;
};

export type PluralForms = {
  one: string;
  few: string;
  many: string;
};

export type AccusativeForms = {
  seconds: PluralForms;
  minutes: PluralForms;
  hours: PluralForms;
  days: PluralForms;
  weeks: PluralForms;
  months: PluralForms;
  years: PluralForms;
};
