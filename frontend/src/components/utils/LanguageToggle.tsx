import React, { useEffect } from "react";
import { LANGUAGE_COOKIE, setMomentLanguage } from "../../libraries/language";
import { useTranslation } from "react-i18next";
import {
  DEFAULT_LANGUAGE,
  Language,
  LANGUAGES,
  resources,
} from "../../libraries/i18n";
import { useCookie } from "../../hooks/use-cookie";

const LANGUAGE_NAMES: Record<Language, string> = {
  en: "English",
  "zh-Hans": "简体中文",
  vi: "Tiếng Việt",
  ru: "Русский",
};

const LanguageToggle = () => {
  const { i18n, ready } = useTranslation();
  const [language, setLanguage] = useCookie(LANGUAGE_COOKIE, DEFAULT_LANGUAGE);
  useEffect(() => {
    if (!ready) {
      return;
    }
    Object.entries(resources[language]).forEach(([namespace, resource]) => {
      if (!i18n.hasResourceBundle(language, namespace)) {
        i18n.addResourceBundle(language, namespace, resource);
      }
    });
    i18n.changeLanguage(language);
    setMomentLanguage(language);
  }, [i18n, language, ready]);

  return (
    <select
      className="lang-selector"
      name="lang"
      value={i18n.language}
      onChange={(e) => setLanguage(e.currentTarget.value as Language)}
    >
      {LANGUAGES.map((langCode) => (
        <option key={langCode} value={langCode}>
          {LANGUAGE_NAMES[langCode]}
        </option>
      ))}
    </select>
  );
};

export default LanguageToggle;
