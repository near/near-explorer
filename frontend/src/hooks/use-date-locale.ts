import React from "react";
import { Language } from "@explorer/frontend/libraries/i18n";
import {
  Locale,
  getDateLocale,
} from "@explorer/frontend/libraries/date-locale";

export const useDateLocale = (
  initialLocale: Locale | undefined,
  language: Language
) => {
  const [locale, setLocale] = React.useState(initialLocale);
  React.useEffect(
    () => void getDateLocale(language).then(setLocale),
    [language]
  );
  return locale;
};
