import React from "react";
import { intervalToDuration } from "date-fns";
import { LanguageContext } from "../context/LanguageContext";
import { DurationFormatter } from "../libraries/locales/index";

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

export const useFormatDistanceToNow = () => {
  const { locale } = React.useContext(LanguageContext);
  return React.useCallback(
    (timestamp: number | Date) => {
      if (!locale) {
        return "";
      }
      const duration = intervalToDuration({
        start: timestamp,
        end: new Date(),
      });
      return formatDurationString(duration, locale.durationFormatter);
    },
    [locale]
  );
};
