/**
 * The functions in the language module reused the implementation in NEAR Wallet
 *
 * - https://github.com/near/near-wallet/blob/master/src/utils/getBrowserLocale.js
 * - https://github.com/near/near-wallet/blob/master/src/utils/getUserLocale.js
 */

import { IncomingMessage } from "http";
import { ParsedUrlQuery } from "querystring";

import { getCookiesFromReq } from "@/frontend/libraries/cookie";
import { isLanguage, Language } from "@/frontend/libraries/i18n";

export const LANGUAGE_COOKIE = "NEXT_LOCALE";

interface ScoredLanguage {
  language: Language;
  score: number;
}

/**
 * Parses locales provided from browser through `accept-language` header.
 * @param input
 * @return An array of locale codes. Priority determined by order in array.
 * */
export const parseAcceptLanguage = (input: string): string[] =>
  // Example input: en-US,en;q=0.9,nb;q=0.8,no;q=0.7
  // Contains tags separated by comma.
  // Each tag consists of locale code (2-3 letter language code) and optionally country code
  // after dash. Tag can also contain score after semicolon, that is assumed to match order
  // so it's not explicitly used.
  input.split(",").map((tag) => tag.split(";")[0]);

function findBestSupportedLanguage(
  availableLanguages: readonly Language[],
  browserLanguages: string[]
): Language | undefined {
  const matchedLanguages: Partial<Record<Language, ScoredLanguage>> = {};

  // Process special mappings
  const narrowedLanguages = browserLanguages.map((language) => {
    // Set zh-Hant (Traditional Chinese) as the preferred languages for zh-TW and zh-HK
    if (["zh-TW", "zh-HK"].includes(language)) {
      return "zh-Hant";
    }

    return language;
  });

  for (const [index, browserLanguage] of narrowedLanguages.entries()) {
    // match exact language.
    const matchedExactLanguage = availableLanguages.find(
      (language) => language.toLowerCase() === browserLanguage.toLowerCase()
    );
    if (matchedExactLanguage) {
      matchedLanguages[matchedExactLanguage] = {
        language: matchedExactLanguage,
        score: 1 - index / narrowedLanguages.length,
      };
    } else {
      // match only language code part of the browser locale (not including country).
      const languageCode = browserLanguage.split("-")[0].toLowerCase();
      const matchedPartialLanguage = availableLanguages.find(
        (language) => language.split("-")[0].toLowerCase() === languageCode
      );
      if (matchedPartialLanguage) {
        const existingMatch = matchedLanguages[matchedPartialLanguage];

        // Deduct a thousandth for being non-exact match.
        const newMatchScore = 0.999 - index / narrowedLanguages.length;
        const newMatch: ScoredLanguage = {
          language: matchedPartialLanguage,
          score: newMatchScore,
        };
        if (
          !existingMatch ||
          (existingMatch && existingMatch.score <= newMatchScore)
        ) {
          matchedLanguages[matchedPartialLanguage] = newMatch;
        }
      }
    }
  }

  // Sort the list by score (0 - lowest, 1 - highest).
  if (Object.keys(matchedLanguages).length > 0) {
    return Object.values(matchedLanguages).sort((a, b) => b.score - a.score)[0]
      .language;
  }
}

export function getAcceptedLanguage(
  availableLanguages: readonly Language[],
  acceptedLanguages?: string
): Language | undefined {
  const parsedAcceptedLanguages = acceptedLanguages
    ? parseAcceptLanguage(acceptedLanguages)
    : [];

  if (parsedAcceptedLanguages.length > 0) {
    return findBestSupportedLanguage(
      availableLanguages,
      parsedAcceptedLanguages
    );
  }
}

export const getQueryLanguage = (query: ParsedUrlQuery) => {
  const queryLanguage = Array.isArray(query.language)
    ? query.language[0]
    : query.language;
  if (isLanguage(queryLanguage)) {
    return queryLanguage;
  }
};

const getDefaultServerLanguage = (
  languages: readonly Language[],
  defaultLanguage: Language,
  req: IncomingMessage
) => {
  const parsedCookies = getCookiesFromReq(req);
  const languageCookie = parsedCookies.get(LANGUAGE_COOKIE);
  if (languageCookie && isLanguage(languageCookie)) {
    return languageCookie;
  }
  const acceptedLanguages = req.headers["accept-language"];
  const acceptedLanguage = getAcceptedLanguage(languages, acceptedLanguages);
  if (acceptedLanguage && isLanguage(acceptedLanguage)) {
    return acceptedLanguage;
  }
  return defaultLanguage;
};

export const getServerLanguage = (
  languages: readonly Language[],
  defaultLanguage: Language,
  req: IncomingMessage,
  query: ParsedUrlQuery
): { query: Language | undefined; default: Language } => ({
  query: getQueryLanguage(query),
  default: getDefaultServerLanguage(languages, defaultLanguage, req),
});
