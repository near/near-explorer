import * as React from "react";
import { Language } from "../libraries/i18n";
import { Locale } from "../libraries/date-locale";

export type LanguageContext = {
  language: Language;
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
  locale?: Locale;
};

export const LanguageContext = React.createContext<LanguageContext>({
  language: "en",
  setLanguage: () => {},
});
