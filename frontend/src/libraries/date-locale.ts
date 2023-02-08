import { Locale as RawLocale } from "date-fns";

import { Language } from "@explorer/frontend/libraries/i18n";
import { DurationFormatter } from "@explorer/frontend/libraries/locales/index";

export type Locale = RawLocale & { durationFormatter: DurationFormatter };

export const getDateLocale = async (
  language: Language | "cimode"
): Promise<Locale> => {
  switch (language) {
    case "en":
      return (await import("./locales/en")).locale;
    case "ru":
      return (await import("./locales/ru")).locale;
    case "vi":
      return (await import("./locales/vi")).locale;
    case "zh-Hant":
      return (await import("./locales/zh-Hant")).locale;
    case "zh-Hans":
      return (await import("./locales/zh-Hans")).locale;
    case "uk":
      return (await import("./locales/uk")).locale;
    case "cimode":
      return (await import("./locales/cimode")).locale;
  }
};
