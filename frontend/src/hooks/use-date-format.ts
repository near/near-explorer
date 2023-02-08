import React from "react";

import { addMinutes, format, formatISO } from "date-fns";
import { useTranslation } from "react-i18next";

import { LanguageContext } from "@explorer/frontend/context/LanguageContext";

type Options = Omit<NonNullable<Parameters<typeof format>[2]>, "locale"> & {
  utc?: boolean;
};

export const useDateFormat = () => {
  const { i18n } = useTranslation();
  const { locale } = React.useContext(LanguageContext);
  return React.useCallback(
    (
      date: Date | number,
      dateFormat: string,
      { utc, ...options }: Options = {}
    ) => {
      const tzDate = utc
        ? addMinutes(date, new Date().getTimezoneOffset())
        : date;
      if (i18n.language === "cimode") {
        return `${formatISO(tzDate)} formatted by ${dateFormat}`;
      }
      return format(tzDate, dateFormat, { ...options, locale });
    },
    [locale, i18n.language]
  );
};
