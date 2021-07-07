import translations_en from "../translations/en.global.json";
import translations_zh_hans from "../translations/zh-hans.global.json";

function uniq(arr) {
  return arr.filter((el, index, self) => self.indexOf(el) === index);
}

function normalizeLocales(arr) {
  return arr.map((el) => {
    if (!el || el.indexOf("-") === -1 || el.toLowerCase() !== el) {
      return el;
    }

    const splitEl = el.split("-");
    return `${splitEl[0]}-${splitEl[1].toUpperCase()}`;
  });
}

function getUserLocales() {
  let languageList = [];

  if (typeof window !== "undefined") {
    const { navigator } = window;

    if (navigator.languages) {
      languageList = languageList.concat(navigator.languages);
    }
    if (navigator.language) {
      languageList.push(navigator.language);
    }
    if (navigator.userLanguage) {
      languageList.push(navigator.userLanguage);
    }
    if (navigator.browserLanguage) {
      languageList.push(navigator.browserLanguage);
    }
    if (navigator.systemLanguage) {
      languageList.push(navigator.systemLanguage);
    }
  }

  languageList.push("en-US"); // Fallback

  return normalizeLocales(uniq(languageList));
}

const DEBUG_LOG = false;

const debugLog = (...args) => DEBUG_LOG && console.log(...args);

export function getBrowserLocale(appLanguages) {
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

function findBestSupportedLocale(appLocales, browserLocales) {
  const matchedLocales = {};

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
        const newMatch = {
          code: matchedPartialLocale,
          score: 0.999 - index / walletLocales.length,
        };
        if (
          !existingMatch ||
          (existingMatch && existingMatch.score <= matchedPartialLocale.score)
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

export function setI18N(props) {
  const languages = [
    { name: "English", code: "en" },
    { name: "简体中文", code: "zh-hans" },
  ];

  const browserLanguage = getBrowserLocale(languages.map((l) => l.code));
  const activeLang =
    typeof window === "undefined"
      ? languages[0].code
      : localStorage.getItem("languageCode") ||
        browserLanguage ||
        languages[0].code;

  props.initialize({
    languages,
    options: {
      defaultLanguage: "en",
      onMissingTranslation: ({ defaultTranslation }) => defaultTranslation,
      renderToStaticMarkup: false,
      renderInnerHtml: true,
    },
  });

  props.addTranslationForLanguage(translations_en, "en");
  props.addTranslationForLanguage(translations_zh_hans, "zh-hans");
  props.setActiveLanguage(activeLang);
}
