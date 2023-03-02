import { Locale as RawLocale } from "date-fns";

import { Language } from "@explorer/frontend/libraries/i18n";
import { DurationFormatter } from "@explorer/frontend/libraries/locales/index";

export type Locale = RawLocale & { durationFormatter: DurationFormatter };

type LanguageCi = Language | "cimode";

const cachedLocales: Partial<Record<LanguageCi, Locale>> = {};

const getDateLocaleModule = (
  language: LanguageCi
): Promise<{ locale: Locale }> => {
  switch (language) {
    case "en":
      return import("./locales/en");
    case "ru":
      return import("./locales/ru");
    case "vi":
      return import("./locales/vi");
    case "zh-Hant":
      return import("./locales/zh-Hant");
    case "zh-Hans":
      return import("./locales/zh-Hans");
    case "uk":
      return import("./locales/uk");
    case "cimode":
      return import("./locales/cimode");
  }
};

export const getCachedDateLocale = (language: LanguageCi): Locale | undefined =>
  cachedLocales[language];

export const setCachedDateLocale = (language: LanguageCi, locale: Locale) => {
  cachedLocales[language] = locale;
};

export const getDateLocale = async (language: LanguageCi): Promise<Locale> => {
  const { locale } = await getDateLocaleModule(language);
  return locale;
};
