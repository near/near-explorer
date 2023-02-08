import { i18n } from "i18next";
import React from "react";
import { Language, resources } from "@explorer/frontend/libraries/i18n";
import { useOnce } from "@explorer/frontend/hooks/use-once";

export const useI18n = (
  initialState: i18n | (() => i18n),
  language: Language
) => {
  const [i18n] = React.useState(initialState);
  React.useEffect(() => {
    if (!i18n.isInitialized) {
      return;
    }
    Object.entries(resources[language]).forEach(([namespace, resource]) => {
      if (!i18n.hasResourceBundle(language, namespace)) {
        i18n.addResourceBundle(language, namespace, resource);
      }
    });
    i18n.changeLanguage(language);
  }, [i18n, language]);
  useOnce(() => void i18n.init());
};
