import * as React from "react";

import { Locale } from "@explorer/frontend/libraries/date-locale";
import { Language } from "@explorer/frontend/libraries/i18n";

export type LanguageContextType = {
  language: Language;
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
  locale?: Locale;
};

export const LanguageContext = React.createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
});
