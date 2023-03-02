import * as React from "react";

import { Language } from "@explorer/frontend/libraries/i18n";

export type LanguageContextType = {
  language: Language;
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
};

export const LanguageContext = React.createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
});
