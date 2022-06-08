import React from "react";
import { Language } from "../libraries/i18n";
import { LANGUAGE_COOKIE } from "../libraries/language";
import { useSetCookie } from "./use-set-cookie";

export const useLanguageCookie = (language: Language) => {
  const setCookie = useSetCookie(LANGUAGE_COOKIE);
  React.useEffect(() => setCookie(language), [language]);
};
