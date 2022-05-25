export const MAX_LOGGABLE_CHARS = 100;
export const trimError = (e: unknown): string => {
  const stringifiedError = String(e);
  return `${stringifiedError.slice(0, MAX_LOGGABLE_CHARS)}${
    stringifiedError.length > MAX_LOGGABLE_CHARS
      ? `... (${stringifiedError.length - MAX_LOGGABLE_CHARS} symbols more)`
      : ""
  }`;
};
