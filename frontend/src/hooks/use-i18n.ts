import React from "react";

import { i18n as I18n } from "i18next";

import { Language, resources } from "@explorer/frontend/libraries/i18n";

export const useI18n = (
  initialState: I18n | (() => I18n),
  language: Language
) => {
  const [i18n] = React.useState(initialState);
  React.useEffect(() => {
    if (!i18n.isInitialized) {
      i18n.init();
      return;
    }
    Object.entries(resources[language]).forEach(([namespace, resource]) => {
      if (!i18n.hasResourceBundle(language, namespace)) {
        i18n.addResourceBundle(language, namespace, resource);
      }
    });
    i18n.changeLanguage(language);
  }, [i18n, language]);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (typeof window === "undefined" ? !i18n.isInitialized : !mounted) {
    i18n.init();
  }
};
