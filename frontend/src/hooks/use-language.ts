import React from "react";

import { useTranslation } from "next-i18next";

import { isLanguage, Language } from "@explorer/frontend/libraries/i18n";

export const useLanguage = () => {
  const { i18n } = useTranslation();
  const setLanguage = React.useCallback(
    (value: string) => {
      if (!isLanguage(value)) {
        return;
      }
      i18n.changeLanguage(value as Language);
    },
    [i18n]
  );
  return [i18n.language as Language, setLanguage] as const;
};
