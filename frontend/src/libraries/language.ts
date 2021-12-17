/**
 * The functions in the language module reused the implementation in NEAR Wallet
 *
 * - https://github.com/near/near-wallet/blob/master/src/utils/getBrowserLocale.js
 * - https://github.com/near/near-wallet/blob/master/src/utils/getUserLocale.js
 */

import translations_en from "../translations/en.global.json";
import translations_zh_hans from "../translations/zh-hans.global.json";
import translations_vi from "../translations/vi.global.json";
import translations_ru from "../translations/ru.global.json";
import moment from "./moment";
import Cookies from "universal-cookie";
import {
  InitializePayload,
  LocalizeContextProps,
  NamedLanguage,
} from "react-localize-redux";

interface Language {
  code: string;
  score: number;
}

interface LanguageInput {
  cookies?: string;
  acceptedLanguages?: string;
}

function uniq<T>(arr: T[]): T[] {
  return arr.filter((el, index, self) => self.indexOf(el) === index);
}

function normalizeLocales(arr: string[]): string[] {
  return arr.map((el) => {
    if (!el || el.indexOf("-") === -1 || el.toLowerCase() !== el) {
      return el;
    }

    const splitEl = el.split("-");
    return `${splitEl[0]}-${splitEl[1].toUpperCase()}`;
  });
}

function getUserLocales(): string[] {
  let languageList: string[] = [];

  if (typeof window !== "undefined") {
    const { navigator } = window;

    if (navigator.languages) {
      languageList = languageList.concat(navigator.languages);
    }
    // https://caniuse.com/mdn-api_navigator_language
    // 97.31% users have this property as of 2021-12-15
    if (navigator.language) {
      languageList.push(navigator.language);
    }
  }

  languageList.push("en-US"); // Fallback

  return normalizeLocales(uniq(languageList));
}

const DEBUG_LOG = false;

const debugLog = (...args: unknown[]) => DEBUG_LOG && console.log(...args);

/**
 * Parses locales provided from browser through `accept-language` header.
 * @param input
 * @return An array of locale codes. Priority determined by order in array.
 **/
export const parseAcceptLanguage = (input: string): string[] => {
  // Example input: en-US,en;q=0.9,nb;q=0.8,no;q=0.7
  // Contains tags separated by comma.
  // Each tag consists of locale code (2-3 letter language code) and optionally country code
  // after dash. Tag can also contain score after semicolon, that is assumed to match order
  // so it's not explicitly used.
  return input.split(",").map((tag) => tag.split(";")[0]);
};

export function getBrowserLocale(appLanguages: string[]): string | undefined {
  const browserLanguages = getUserLocales();

  debugLog("Languages from browser:", browserLanguages);

  if (
    appLanguages &&
    appLanguages.length > 0 &&
    browserLanguages &&
    browserLanguages.length > 0
  ) {
    return findBestSupportedLocale(appLanguages, browserLanguages);
  }
}

export function getAcceptedLocale(
  appLanguages: string[],
  acceptedLanguages?: string
): string | undefined {
  const parsedAcceptedLanguages =
    acceptedLanguages && parseAcceptLanguage(acceptedLanguages);

  debugLog(
    "Languages from Accepted Languages header:",
    parsedAcceptedLanguages
  );

  if (
    appLanguages &&
    appLanguages.length > 0 &&
    parsedAcceptedLanguages &&
    parsedAcceptedLanguages.length > 0
  ) {
    return findBestSupportedLocale(appLanguages, parsedAcceptedLanguages);
  }
}

function findBestSupportedLocale(
  appLocales: string[],
  browserLocales: string[]
): string | undefined {
  const matchedLocales: Record<string, Language> = {};

  // Process special mappings
  const walletLocales = browserLocales.map((locale) => {
    // Handle special cases for traditional Chinesee fallback
    if (["zh-TW", "zh-HK"].includes(locale)) {
      return "zh-hant";
    }

    return locale;
  });

  for (const [index, browserLocale] of walletLocales.entries()) {
    // match exact locale.
    const matchedExactLocale = appLocales.find(
      (appLocale) => appLocale.toLowerCase() === browserLocale.toLowerCase()
    );
    if (matchedExactLocale) {
      debugLog("Found direct match:", { browserLocale, matchedExactLocale });
      matchedLocales[matchedExactLocale] = {
        code: matchedExactLocale,
        score: 1 - index / walletLocales.length,
      };
    } else {
      // match only locale code part of the browser locale (not including country).
      const languageCode = browserLocale.split("-")[0].toLowerCase();
      const matchedPartialLocale = appLocales.find(
        (appLocale) => appLocale.split("-")[0].toLowerCase() === languageCode
      );
      if (matchedPartialLocale) {
        const existingMatch = matchedLocales[matchedPartialLocale];

        // Deduct a thousandth for being non-exact match.
        const newMatchScore = 0.999 - index / walletLocales.length;
        const newMatch = {
          code: matchedPartialLocale,
          score: newMatchScore,
        };
        if (
          !existingMatch ||
          (existingMatch && existingMatch.score <= newMatchScore)
        ) {
          debugLog("Found language-only match:", {
            browserLocale,
            matchedPartialLocale,
          });
          matchedLocales[matchedPartialLocale] = newMatch;
        }
      }
    }
  }

  // Sort the list by score (0 - lowest, 1 - highest).
  if (Object.keys(matchedLocales).length > 0) {
    const bestMatch = Object.values(matchedLocales).sort(
      (localeA, localeB) => localeB.score - localeA.score
    )[0].code;
    debugLog("bestMatch", bestMatch);
    return bestMatch;
  }
}

export function setMomentLocale(code: string): void {
  let locale;
  switch (code) {
    case "ru":
      locale = "ru";
      break;
    case "vi":
      locale = "vi";
      break;
    case "zh-hans":
      locale = "zh-cn";
      break;
    default:
      locale = "en";
  }
  moment.locale(locale);
}

function getLanguage(
  languages: NamedLanguage[],
  { cookies, acceptedLanguages }: LanguageInput = {}
) {
  if (typeof window === "undefined") {
    return (
      new Cookies(cookies || undefined).get("NEXT_LOCALE") ||
      getAcceptedLocale(
        languages.map((l) => l.code),
        acceptedLanguages
      ) ||
      languages[0].code
    );
  } else {
    return (
      new Cookies().get("NEXT_LOCALE") ||
      getBrowserLocale(languages.map((l) => l.code)) ||
      languages[0].code
    );
  }
}

function getI18nConfig(): InitializePayload {
  return {
    languages: [
      { name: "English", code: "en" },
      { name: "简体中文", code: "zh-hans" },
      { name: "Tiếng Việt", code: "vi" },
      { name: "Русский", code: "ru" },
    ],
    options: {
      defaultLanguage: "en",
      onMissingTranslation: ({ defaultTranslation }) => defaultTranslation,
      renderToStaticMarkup: false,
      renderInnerHtml: false,
    },
  };
}

export function getI18nConfigForProvider({
  cookies,
  acceptedLanguages,
}: LanguageInput): InitializePayload | undefined {
  if (typeof window === "undefined") {
    let config = getI18nConfig();
    const { languages } = config;
    const activeLang = getLanguage(languages as NamedLanguage[], {
      cookies,
      acceptedLanguages,
    });
    switch (activeLang) {
      case "ru":
        config.translation = translations_ru;
        break;
      case "zh-hans":
        config.translation = translations_zh_hans;
        break;
      case "vi":
        config.translation = translations_vi;
        break;
      default:
        config.translation = translations_en;
    }
    return config;
  }
}

export function setI18N(props: LocalizeContextProps): void {
  const config = getI18nConfig();
  const { languages } = config;
  const activeLang = getLanguage(languages as NamedLanguage[]);

  props.initialize(config);
  props.addTranslationForLanguage(translations_en, "en");
  props.addTranslationForLanguage(translations_zh_hans, "zh-hans");
  props.addTranslationForLanguage(translations_vi, "vi");
  props.addTranslationForLanguage(translations_ru, "ru");
  props.setActiveLanguage(activeLang);

  setMomentLocale(activeLang);
}
