import { i18n, createInstance } from "i18next";
import { initReactI18next } from "react-i18next";

import ruTranslation from "@explorer/frontend/translations/ru/common.json";
import enTranslation from "@explorer/frontend/translations/en/common.json";
import viTranslation from "@explorer/frontend/translations/vi/common.json";
import zhHantTranslation from "@explorer/frontend/translations/zh-hant/common.json";
import zhHansTranslation from "@explorer/frontend/translations/zh-hans/common.json";
import uaTranslation from "@explorer/frontend/translations/ua/common.json";

export const LANGUAGES = [
  "en",
  "ru",
  "vi",
  "zh-Hant",
  "zh-Hans",
  "uk",
] as const;
export type Language = typeof LANGUAGES[number];
export const NAMESPACES = ["common"] as const;
export type I18nNamespace = typeof NAMESPACES[number];

export const DEFAULT_LANGUAGE: Language = "en";
export const DEFAULT_NAMESPACE: I18nNamespace = "common";

export type ResourceType = {
  common: typeof enTranslation;
};

export const resources: Record<Language, ResourceType> = {
  en: { common: enTranslation },
  ru: { common: ruTranslation },
  vi: { common: viTranslation },
  "zh-Hant": { common: zhHantTranslation },
  "zh-Hans": { common: zhHansTranslation },
  uk: { common: uaTranslation },
};

export const createI18n = (language?: Language): i18n => {
  return createInstance({
    resources,
    fallbackLng: DEFAULT_LANGUAGE,
    lng: language || DEFAULT_LANGUAGE,
    supportedLngs: LANGUAGES,
    defaultNS: DEFAULT_NAMESPACE,
    interpolation: {
      escapeValue: false,
      prefix: "${",
      suffix: "}",
    },
  }).use(initReactI18next);
};
