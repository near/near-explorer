import translations_en from "../translations/en.global.json";
import translations_zh_hans from "../translations/zh-hans.global.json";

export function getBrowserLocale(appLanguages) {
  if (typeof navigator !== "undefined" && navigator.languages) {
    return matchBrowserLocale(appLanguages, navigator.languages);
  } else {
    return undefined;
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

function matchBrowserLocale(appLocales, browserLocales) {
  const matchedLocales = [];

  // special handling for traditional Chinese
  for (const browserCode of browserLocales) {
    if (["zh-TW", "zh-HK"].includes(browserCode)) {
      return "zh-hant";
    }
  }

  // first pass: match exact locale.
  for (const [index, browserCode] of browserLocales.entries()) {
    const matchedLocale = appLocales.find(
      (appLocale) => appLocale.toLowerCase() === browserCode.toLowerCase()
    );
    if (matchedLocale) {
      matchedLocales.push({
        code: matchedLocale,
        score: 1 - index / browserLocales.length,
      });
      break;
    }
  }

  // second pass: match only locale code part of the browser locale (not including country).
  for (const [index, browserCode] of browserLocales.entries()) {
    const languageCode = browserCode.split("-")[0].toLowerCase();
    const matchedLocale = appLocales.find(
      (appLocale) => appLocale.split("-")[0].toLowerCase() === languageCode
    );
    if (matchedLocale) {
      // Deduct a thousandth for being non-exact match.
      matchedLocales.push({
        code: matchedLocale,
        score: 0.999 - index / browserLocales.length,
      });
      break;
    }
  }

  // Sort the list by score (0 - lowest, 1 - highest).
  if (matchedLocales.length > 1) {
    matchedLocales.sort((localeA, localeB) => {
      if (localeA.score === localeB.score) {
        // If scores are equal then pick more specific (longer) code.
        return localeB.code.length - localeA.code.length;
      }

      return localeB.score - localeA.score;
    });
  }

  return matchedLocales.length ? matchedLocales[0].code : undefined;
}
