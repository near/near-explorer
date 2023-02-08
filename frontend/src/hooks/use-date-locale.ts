import React from "react";

import {
  Locale,
  getDateLocale,
} from "@explorer/frontend/libraries/date-locale";
import { Language } from "@explorer/frontend/libraries/i18n";

export const useDateLocale = (
  initialLocale: Locale | undefined,
  language: Language
) => {
  const [locale, setLocale] = React.useState(initialLocale);
  React.useEffect(() => {
    getDateLocale(language).then(setLocale);
  }, [language]);
  return locale;
};
