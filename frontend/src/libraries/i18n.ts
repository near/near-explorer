import { CustomTypeOptions } from "i18next";
import ChainedBackend from "i18next-chained-backend";
import HttpBackend from "i18next-http-backend";
import LocalStorageBackend from "i18next-localstorage-backend";
import { UserConfig } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { HOUR } from "@explorer/frontend/libraries/time";

// eslint-disable-next-line no-relative-import-paths/no-relative-import-paths
import {
  i18n as i18nNextConfig,
  Language,
  LANGUAGES,
  DEFAULT_LANGUAGE,
} from "../../i18n.next.config";

export const isLanguage = (input: string): input is Language =>
  LANGUAGES.includes(input as Language);

export const i18nUserConfig: UserConfig = {
  interpolation: {
    escapeValue: false,
    prefix: "${",
    suffix: "}",
  },
  i18n: i18nNextConfig,
  // ${foo} pattern is currently used in translation files
  // eslint-disable-next-line no-template-curly-in-string
  localeStructure: "${lng}/${ns}",
  reloadOnPrerender: process.env.NODE_ENV !== "production",
  fallbackLng: false,
  backend: {
    backendOptions: [
      { expirationTime: HOUR },
      // ${foo} pattern is currently used in translation files
      // eslint-disable-next-line no-template-curly-in-string
      { loadPath: "/locales/${lng}/${ns}.json" },
    ],
    backends:
      typeof window !== "undefined" ? [LocalStorageBackend, HttpBackend] : [],
  },
  serializeConfig: false,
  use: typeof window !== "undefined" ? [ChainedBackend] : [],
  partialBundledLanguages: true,
};

const namespaces: CustomTypeOptions["defaultNS"][] = ["common"];

export const getSsrProps = (locale: Language) =>
  serverSideTranslations(locale, namespaces, i18nUserConfig);

export { LANGUAGES, DEFAULT_LANGUAGE };

export type { Language };
