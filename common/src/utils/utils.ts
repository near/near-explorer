export const notNullishGuard = <T>(
  arg: T
): arg is Exclude<T, null | undefined> => arg !== null && arg !== undefined;

export const id = <X>(input: X) => input;
