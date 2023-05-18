import React from "react";

import { useLanguage } from "@/frontend/hooks/use-language";
import {
  fetchDateLocale,
  getCachedDateLocale,
  getLocaleSync,
  setCachedDateLocale,
} from "@/frontend/libraries/date-locale";

export const useDateLocale = () => {
  const [language] = useLanguage();
  const [locale, setLocale] = React.useState(getLocaleSync(language));
  React.useEffect(() => {
    const cachedLocale = getCachedDateLocale(language);
    if (cachedLocale) {
      setLocale(cachedLocale);
    } else {
      fetchDateLocale(language).then((loadedLocale) => {
        setCachedDateLocale(language, loadedLocale);
        setLocale(loadedLocale);
      });
    }
  }, [language, locale]);
  return locale;
};
