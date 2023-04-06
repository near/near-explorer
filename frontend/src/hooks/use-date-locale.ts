import React from "react";

import { useLanguage } from "@explorer/frontend/hooks/use-language";
import {
  getDateLocale,
  getCachedDateLocale,
  setCachedDateLocale,
} from "@explorer/frontend/libraries/date-locale";

export const useDateLocale = () => {
  const [language] = useLanguage();
  const [locale, setLocale] = React.useState(getCachedDateLocale(language));
  React.useEffect(() => {
    const cachedLocale = getCachedDateLocale(language);
    if (cachedLocale) {
      setLocale(cachedLocale);
    } else {
      getDateLocale(language).then((loadedLocale) => {
        setCachedDateLocale(language, loadedLocale);
        setLocale(loadedLocale);
      });
    }
  }, [language, locale]);
  return locale;
};
