import * as React from "react";
import { Language } from "../libraries/i18n";

export type LanguageContext = {
  language: Language;
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
};

export const LanguageContext = React.createContext<LanguageContext>({
  language: "en",
  setLanguage: () => {},
});
