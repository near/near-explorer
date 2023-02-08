import * as React from "react";

import { Locale } from "@explorer/frontend/libraries/date-locale";
import { Language } from "@explorer/frontend/libraries/i18n";

export type LanguageContext = {
  language: Language;
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
  locale?: Locale;
};

export const LanguageContext = React.createContext<LanguageContext>({
  language: "en",
  setLanguage: () => {},
});
