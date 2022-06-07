import React from "react";
import { Language } from "../libraries/i18n";
import { setMomentLanguage } from "../libraries/language";
import { useOnce } from "./use-once";

export const useMomentLanguage = (language: Language) => {
  const setDateLanguage = React.useCallback(
    () => void setMomentLanguage(language),
    [language]
  );
  useOnce(setDateLanguage);
  React.useEffect(setDateLanguage, [setDateLanguage]);
};
