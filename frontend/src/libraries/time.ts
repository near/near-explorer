import { DurationFormatter } from "@explorer/frontend/libraries/locales/index";

export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;
export const YEAR = 365 * DAY;

const durationKeys = [
  "years",
  "months",
  "weeks",
  "days",
  "hours",
  "minutes",
  "seconds",
] as const;

export const formatDurationString = (
  duration: Duration,
  formatter: DurationFormatter
) => {
  const isFuture = durationKeys.some((key) => (duration[key] ?? 0) < 0);
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
