import { CustomTypeOptions } from "i18next";

import type enTranslation from "./public/locales/en/common.json";
import type ruTranslation from "./public/locales/ru/common.json";
import type uaTranslation from "./public/locales/uk/common.json";
import type viTranslation from "./public/locales/vi/common.json";
import type zhHansTranslation from "./public/locales/zh-Hans/common.json";
import type zhHantTranslation from "./public/locales/zh-Hant/common.json";

type Narrower<X> = <T>() => T extends X ? 1 : 2;
type Equals<X, Y> = Narrower<X> extends Narrower<Y> ? true : false;

type AllowOnlyFalse<T extends false> = T;

type NS<Common> = { common: Common };

type TranslationEn = NS<typeof enTranslation>;

type TranslationRu = Equals<TranslationEn, NS<typeof ruTranslation>>;
type TranslationUa = Equals<TranslationEn, NS<typeof uaTranslation>>;
type TranslationVi = Equals<TranslationEn, NS<typeof viTranslation>>;
type TranslationZhHant = Equals<TranslationEn, NS<typeof zhHantTranslation>>;
type TranslationZhHans = Equals<TranslationEn, NS<typeof zhHansTranslation>>;

export type TranslationTypesAreInvalid = AllowOnlyFalse<
  // If you see an error here - at least one of the "TranslationFoo" types above
  // is false and doesn't fit "TranslationEn" type
  //
  // @ts-expect-error
  TranslationRu &
    TranslationUa &
    TranslationVi &
    TranslationZhHant &
    TranslationZhHans
>;

export const LANGUAGES_MAP = {
  en: true,
  ru: true,
  vi: true,
  "zh-Hant": true,
  "zh-Hans": true,
  uk: true,
} as const;
export const LANGUAGES = Object.keys(LANGUAGES_MAP) as Language[];
export type Language = keyof typeof LANGUAGES_MAP;
export const DEFAULT_LANGUAGE: Language = "en";

const NAMESPACES = ["common"] as const;
export type I18nNamespace = (typeof NAMESPACES)[number];

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: I18nNamespace;
    resources: TranslationEn;
  }
}

type I18n = {
  locales: Language[];
  defaultLocale: Language;
  defaultNS: CustomTypeOptions["defaultNS"];
};

export const i18n: I18n = {
  locales: LANGUAGES,
  defaultLocale: DEFAULT_LANGUAGE,
  defaultNS: "common",
};
