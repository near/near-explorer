export const notNullGuard = <T>(arg: T): arg is Exclude<T, null> =>
  arg !== null;

export const id = <X>(input: X) => input;
