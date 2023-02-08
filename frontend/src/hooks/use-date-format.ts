import React from "react";
import { addMinutes, format, formatISO } from "date-fns";
import { LanguageContext } from "@explorer/frontend/context/LanguageContext";
import { useTranslation } from "react-i18next";

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
      if (utc) {
        date = addMinutes(date, new Date().getTimezoneOffset());
      }
      if (i18n.language === "cimode") {
        return formatISO(date) + " formatted by " + dateFormat;
      }
      return format(date, dateFormat, { ...options, locale });
    },
    [locale]
  );
};
