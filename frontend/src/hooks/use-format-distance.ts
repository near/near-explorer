import React from "react";
import { intervalToDuration } from "date-fns";
import { LanguageContext } from "@explorer/frontend/context/LanguageContext";
import { DurationFormatter } from "@explorer/frontend/libraries/locales/index";

const durationKeys = [
  "years",
  "months",
  "weeks",
  "days",
  "hours",
  "minutes",
  "seconds",
] as const;

export const isDurationInFuture = (duration: Duration) =>
  durationKeys.some((key) => (duration[key] ?? 0) < 0);

const formatDurationString = (
  duration: Duration,
  formatter: DurationFormatter
) => {
  const isFuture = isDurationInFuture(duration);
  return (
    durationKeys
      .map((key) =>
        duration[key]
          ? formatter.addTimeDirection(formatter[key](duration[key]!), isFuture)
          : undefined
      )
      .find(Boolean) || formatter.justNow()
  );
};

export const useFormatDistance = () => {
  const { locale } = React.useContext(LanguageContext);
  return React.useCallback(
    (
      timestampStart: number | Date,
      timestampEnd: number | Date = new Date()
    ) => {
      if (!locale) {
        return "";
      }
      const duration = intervalToDuration({
        start: timestampStart,
        end: timestampEnd,
      });
      return formatDurationString(duration, locale.durationFormatter);
    },
    [locale]
  );
};
