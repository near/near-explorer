import React from "react";

import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import { isLanguage, Language } from "@explorer/frontend/libraries/i18n";
import { getQueryLanguage } from "@explorer/frontend/libraries/language";

export const useLanguage = () => {
  const { i18n } = useTranslation();
  const router = useRouter();
  const queryLanguage = getQueryLanguage(router.query);
  const setLanguage = React.useCallback(
    (value: string) => {
      if (!isLanguage(value)) {
        return;
      }
      i18n.changeLanguage(value as Language);
    },
    [i18n]
  );
  return [
    queryLanguage || (i18n.language as Language),
    setLanguage,
    Boolean(queryLanguage),
  ] as const;
};
