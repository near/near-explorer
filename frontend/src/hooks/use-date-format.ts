import React from "react";

import { addMinutes, format, formatISO } from "date-fns";
import { useTranslation } from "next-i18next";

import { SSRContext } from "@explorer/frontend/context/SSRContext";
import { useDateLocale } from "@explorer/frontend/hooks/use-date-locale";

type Options = Omit<NonNullable<Parameters<typeof format>[2]>, "locale"> & {
  utc?: boolean;
};

export const useDateFormat = () => {
  const { i18n } = useTranslation();
  const locale = useDateLocale();
  const { tzOffset: ssrTzOffset, isFirstRender } = React.useContext(SSRContext);
  return React.useCallback(
    (
      date: Date | number,
      dateFormat: string,
      { utc, ...options }: Options = {}
    ) => {
      let tzDate = date;
      if (utc) {
        tzDate = addMinutes(date, new Date().getTimezoneOffset());
      } else if (typeof window !== "undefined") {
        tzDate = isFirstRender
          ? addMinutes(date, new Date().getTimezoneOffset() - ssrTzOffset)
          : date;
      }
      if (i18n.language === "cimode") {
        return `${formatISO(tzDate)} formatted by ${dateFormat}`;
      }
      return format(tzDate, dateFormat, { ...options, locale });
    },
    [locale, i18n.language, ssrTzOffset, isFirstRender]
  );
};
